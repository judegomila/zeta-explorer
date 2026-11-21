/**
 * imp-95457 -- plain WHAT-REMAINS status note for the off-lattice
 * Riesz-floor leg of the seam Gram chain, recording that imp-95419
 * THEOREM SEP-OPT collapsed the imp-95335 two-sided [A_sep, A_lat]
 * sharpness bracket AT THE TOP: the class-optimal m-uniform floor
 * A_opt(delta) equals the geometric-lattice Szego infimum exactly, i.e.
 * the lattice is the extremal (worst) delta-separated configuration.
 *
 * GRADE: documentation only. This module imports no heavy bundle and
 * proves nothing new; it restates the imp-95335 / imp-95419 module text
 * as a {item, status, note} WHAT-REMAINS ledger, in the same shape used
 * by the imp-95438 input-reduction ledger.
 *
 * SETTLED (imp-95419 THEOREM SEP-OPT). For every rate set whose
 * log-rates are pairwise separated by delta > 0, and every count m,
 *   lambda_min(Gtilde_m) >= A_opt(delta) = A_lat(delta)
 *     = sum_(n in Z) (-1)^n sech(n delta/2)
 *     = (4 pi/delta) sum_(n>=0) sech(pi^2(2n+1)/delta) ,
 * where A_lat is the imp-95252 geometric-lattice Szego symbol infimum.
 * This supersedes the imp-95335 Ingham-type floor A_sep by the FULL
 * bracket width: 52.4666x at delta = ln 2, 133.5447x at delta = ln 1.3.
 * The bracket [A_sep, A_lat] does not narrow -- it collapses to a single
 * point at its upper end, because the lattice itself is a member of the
 * delta-separated class and its Toeplitz lambda_min decreases (Szego) to
 * A_lat, so no m-uniform class constant could ever exceed A_lat; SEP-OPT
 * shows none can fall below it either.
 *
 * RESIDUAL OFF-LATTICE GAP (not the scalar floor anymore). Substituting
 * A_opt for A_sep in the imp-95335 COROLLARY SPLIT-SEP chain drops the
 * m-uniform off-lattice every-octave onset from 23.157604 to 20.593144
 * (COROLLARY SPLIT-OPT). Ledger of onsets, increasing:
 *   lattice-pinned SPLIT-RZ (15.981584) <
 *   SPLIT-OPT, off-lattice m-uniform (20.593144) <
 *   SPLIT-SEP, old off-lattice (23.157604) <
 *   lattice-only SPLIT-LOO (27.035582).
 * The gap SPLIT-OPT - SPLIT-RZ (4.611560) is now attributable to BLOCK
 * structure (a scalar per-pair floor vs. the lattice's sharper twin-pair
 * symbol), not to slack in the scalar floor itself -- that slack is gone.
 *
 * STILL-OPEN LEGS (unaffected by SEP-OPT). (1) Signed WEIGHT leg: no
 * off-lattice treatment of signed/weighted coefficient certificates.
 * (2) Modulus/phase leg: open. (3) imp-95212 Fresnel-Airy envelope port:
 * open. (4) The chart-refined block symbol-pencil program RZ-PEN2..
 * RZ-PEN8 (imp-95328..95334) stays LATTICE-PINNED and is not ported --
 * its Toeplitz symbol does not exist off-lattice; on the lattice its
 * refined floors remain sharper than SPLIT-OPT. (5) NOT r-uniform:
 * A_opt(delta) -> 0 doubly exponentially as delta -> 0 (imp-95252
 * coalescence witness), so coalescent blocks still route to
 * EV-OCT-UNIF / COAL-N, not to this floor. (6) Classical-input ledger
 * (imp-95438): CLV extremal-minorant existence/value remains the one
 * still-cited non-elementary input of the SEP-OPT chain (Brownian
 * exit-time positivity already eliminated by imp-95420); CLV
 * self-containment stays the open imp-95441 assessment.
 *
 * NET EFFECT. The off-lattice Riesz-floor leg's SCALAR question is
 * closed at the class level: the lattice value is both the ceiling and
 * the floor, so no better m-uniform scalar constant can ever be found.
 * What remains open is entirely structural (blocks, signs, phase,
 * envelope port) or citation-level (CLV), not scalar-floor slack.
 * Changes no Lambda bound; NO QED; no refereed bound is changed.
 */

export const OFF_LATTICE_RIESZ_FLOOR_STATUS = [
  {
    item: 'Scalar m-uniform off-lattice floor A_opt(delta) vs. the imp-95335 bracket [A_sep, A_lat]',
    status: 'SETTLED',
    note:
      'imp-95419 THEOREM SEP-OPT proves A_opt(delta) = A_lat(delta) exactly: ' +
      'the class-optimal floor equals the lattice Szego infimum, ' +
      'superseding A_sep by 52.4666x (delta=ln 2) / 133.5447x ' +
      '(delta=ln 1.3); the lattice is the extremal delta-separated ' +
      'configuration, so no scalar slack remains at the class level',
  },
  {
    item: 'Off-lattice every-octave onset (COROLLARY SPLIT-OPT vs. SPLIT-SEP)',
    status: 'IMPROVED, RESIDUAL GAP RELOCATED',
    note:
      'onset drops 23.157604 -> 20.593144 (2.564460 depth units); the ' +
      'remaining gap to the lattice-pinned SPLIT-RZ onset (15.981584) is ' +
      'now BLOCK structure (scalar floor vs. twin-pair symbol), not ' +
      'scalar-floor slack',
  },
  {
    item: 'Chart-refined block symbol-pencil program RZ-PEN2..RZ-PEN8',
    status: 'OPEN, LATTICE-PINNED',
    note:
      'not ported off-lattice -- its Toeplitz symbol does not exist off ' +
      'the lattice; remains sharper than SPLIT-OPT on the lattice itself',
  },
  {
    item: 'r-uniformity at coalescence',
    status: 'OPEN, STRUCTURAL',
    note:
      'A_opt(delta) -> 0 doubly exponentially as delta -> 0 (imp-95252 ' +
      'coalescence witness forces collapse of every m-uniform ' +
      'coefficient-norm constant); coalescent blocks stay routed to ' +
      'EV-OCT-UNIF / COAL-N',
  },
  {
    item: 'Signed WEIGHT leg',
    status: 'OPEN',
    note: 'no off-lattice treatment of signed/weighted coefficient certificates yet',
  },
  {
    item: 'Modulus/phase leg',
    status: 'OPEN',
    note: 'not addressed by SEP-OPT, which is a real-coefficient scalar-floor statement',
  },
  {
    item: 'imp-95212 Fresnel-Airy envelope port',
    status: 'OPEN',
    note: 'unaffected by the scalar-floor closure; stays a separate porting task',
  },
  {
    item: 'CLV extremal-minorant classical input',
    status: 'STILL CITED (per imp-95438)',
    note:
      'the one non-elementary input THEOREM SEP-OPT rests on; Brownian ' +
      'exit-time positivity was eliminated by imp-95420; CLV ' +
      'self-containment is the open imp-95441 assessment',
  },
];

export const OFF_LATTICE_RIESZ_FLOOR_SUMMARY = {
  bracket: 'imp-95335 two-sided [A_sep, A_lat]',
  collapsedBy: 'imp-95419 THEOREM SEP-OPT',
  collapsedAtTop: true,
  supersessionLn2: 52.46661734874133,
  supersessionLn13: 133.54473330726987,
  onsetOld: 23.157604,
  onsetNew: 20.593144,
  onsetLatticeSplitRz: 15.981584,
  onsetLatticeSplitLoo: 27.035582,
  scalarFloorSlackRemaining: false,
  boundChange: false,
  qed: false,
};

export const IMP_95457_OFF_LATTICE_RIESZ_FLOOR_STATUS_NOTE = {
  id: 'imp-95457-off-lattice-riesz-floor-status-note',
  title:
    'imp-95419 SEP-OPT collapses the imp-95335 [A_sep, A_lat] off-lattice ' +
    'Riesz-floor bracket at the top (lattice = class-optimal): plain ' +
    'WHAT-REMAINS status note',
  status: OFF_LATTICE_RIESZ_FLOOR_STATUS,
  summary: OFF_LATTICE_RIESZ_FLOOR_SUMMARY,
  note:
    'documentation only, citing imp-95335 (Ingham floor A_sep), imp-95419 ' +
    '(THEOREM SEP-OPT), and imp-95438 (classical-input ledger); no Lambda ' +
    'bound moves; no refereed bound is changed',
  closesTickets: ['imp-95457'],
};

// -- assertions (import-light; exact-literal consistency only) -------------
export const IMP_95457_ASSERTIONS = [
  {
    id: 'imp-95457-eight-status-rows',
    holds: () => OFF_LATTICE_RIESZ_FLOOR_STATUS.length === 8,
    why: 'the status note names exactly eight items: the settled scalar floor, the relocated onset gap, and six still-open or still-cited legs.',
  },
  {
    id: 'imp-95457-scalar-floor-settled',
    holds: () =>
      OFF_LATTICE_RIESZ_FLOOR_STATUS.some(
        (row) => row.item.includes('Scalar m-uniform off-lattice floor') && row.status === 'SETTLED',
      ),
    why: 'the imp-95335 bracket must be recorded as SETTLED by imp-95419 THEOREM SEP-OPT, not merely narrowed.',
  },
  {
    id: 'imp-95457-supersession-matches-imp-95419',
    holds: () =>
      OFF_LATTICE_RIESZ_FLOOR_SUMMARY.supersessionLn2 === 52.46661734874133 &&
      OFF_LATTICE_RIESZ_FLOOR_SUMMARY.supersessionLn13 === 133.54473330726987,
    why: 'the supersession factors must match the imp-95419 baked literals exactly (52.4666x at ln 2, 133.5447x at ln 1.3).',
  },
  {
    id: 'imp-95457-onset-ordering-preserved',
    holds: () => {
      const s = OFF_LATTICE_RIESZ_FLOOR_SUMMARY;
      return s.onsetLatticeSplitRz < s.onsetNew && s.onsetNew < s.onsetOld && s.onsetOld < s.onsetLatticeSplitLoo;
    },
    why: 'the onset ledger must preserve the strict ordering SPLIT-RZ < SPLIT-OPT < SPLIT-SEP < SPLIT-LOO recorded by imp-95419.',
  },
  {
    id: 'imp-95457-open-legs-named',
    holds: () => {
      const items = OFF_LATTICE_RIESZ_FLOOR_STATUS.map((r) => r.item);
      return (
        items.some((i) => i.includes('Signed WEIGHT')) &&
        items.some((i) => i.includes('Modulus/phase')) &&
        items.some((i) => i.includes('imp-95212'))
      );
    },
    why: 'the three named still-open legs from the imp-95419 honest-scope paragraph (signed WEIGHT, modulus/phase, imp-95212 envelope port) must each appear as their own row.',
  },
  {
    id: 'imp-95457-no-scalar-slack-remaining',
    holds: () => OFF_LATTICE_RIESZ_FLOOR_SUMMARY.scalarFloorSlackRemaining === false,
    why: 'the note must state plainly that the scalar-floor question is closed at the class level -- what remains open is structural or citation-level, not scalar-floor slack.',
  },
  {
    id: 'imp-95457-not-a-bound',
    holds: () => OFF_LATTICE_RIESZ_FLOOR_SUMMARY.boundChange === false && OFF_LATTICE_RIESZ_FLOOR_SUMMARY.qed === false,
    why: 'this is a documentation status note; it moves no Lambda bound and proves no QED.',
  },
  {
    id: 'imp-95457-closes-self',
    holds: () => IMP_95457_OFF_LATTICE_RIESZ_FLOOR_STATUS_NOTE.closesTickets.includes('imp-95457'),
    why: 'this module is the deliverable the imp-95457 ticket asked for.',
  },
];

for (const a of IMP_95457_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95457-off-lattice-riesz-floor-status-note assertion failed: ${a.id}`);
  }
}

export default IMP_95457_OFF_LATTICE_RIESZ_FLOOR_STATUS_NOTE;
