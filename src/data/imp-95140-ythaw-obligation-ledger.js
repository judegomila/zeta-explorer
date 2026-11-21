/**
 * imp-95140-ythaw-obligation-ledger — single-reference roll-up of the six
 * y-thaw-01775943 package obligations O1-O6 at the thawed floor y = 0.1808
 * (candidate value 0.17759432 = 129/800 + 0.1808^2/2).
 *
 * GRADE: documentation only. This module imports no heavy bundle and
 * produces no new certificate; it re-states the per-obligation verdicts
 * already recorded in imp-95129/95130/95131/95132/95212 as one table.
 * O3 (E_max budget) and O5 (site coverage) CLOSE under our toolchain
 * (imp-95212). O1 (sharp-mass y-monotonicity), O2 (barrier/winding slab),
 * O4 (analytic tail N > 3840000), and O6 (criterion assembly) remain OPEN.
 * 0.17759432 stays a package VALUE, not a bound. NO QED.
 * No refereed bound is changed.
 *
 * Source: formalization/y-thaw-01775943/SHARP_WEIGHT_NATIVE_BINDING.md
 * (per-obligation ledger rows), consolidated per the imp-95212/imp-95208
 * obligation lists (frontier scout, imp-95140).
 */

export const YTHAW_OBLIGATION_LEDGER = [
  {
    obligation: 'O1',
    role: 'sharp-mass y-monotonicity (all-y transfer of the sharp floor), RESTATED',
    status: 'OPEN',
    grade: 'route-assessment only (imp-95130): primary route (c) S0-lift, fallback route (d)',
    subGap: 'imp-95130-subgap-gN-monotone-sign',
  },
  {
    obligation: 'O2',
    role: 'barrier/winding slab at bottom edge 0.1808',
    status: 'OPEN',
    grade: 'tractability triage only (imp-95129): cheapest open obligation, error budget ~3.50x below allowance, 0.5198 margin far from exhaustion',
    subGap: 'imp-95129-subgap-slab-arb-rerun',
  },
  {
    obligation: 'O3',
    role: 'E_max budget over y in [0.1808, y_max]',
    status: 'CLOSED',
    grade: 'certified-interval, our toolchain (mpmath.iv 320 bits, imp-95212); inclusion isotonicity, no monotonicity-in-y appeal',
    subGap: null,
  },
  {
    obligation: 'O4',
    role: 'analytic tail N > 3840000 at y = 0.1808',
    status: 'OPEN',
    grade: 'measurement only (imp-95131): tail-entry floor 0.325311 exceeds the O3 budget 1.33e6x, but N-uniform analytic majorants not derived',
    subGap: null,
  },
  {
    obligation: 'O5',
    role: 'left-edge site coverage x_*(0.1808) in W_690988',
    status: 'CLOSED',
    grade: 'certified 3-lane, our toolchain (exact-rational + mpmath.iv 400-bit + Arb/FLINT 400-bit, imp-95212)',
    subGap: null,
  },
  {
    obligation: 'O6',
    role: 'criterion assembly (Cor-3.2-analogue) at (t0, y0)',
    status: 'OPEN',
    grade: 'assessed-reduced (imp-95132): no heavy-compute content of its own, fires iff O1 AND O2 AND O4 close (O3, O5 already closed)',
    subGap: 'imp-95132-subgap-o6-template-lean-check',
  },
];

export const YTHAW_OBLIGATION_SUMMARY = {
  candidateValue: 0.17759432,
  thawedFloorY: 0.1808,
  closed: ['O3', 'O5'],
  open: ['O1', 'O2', 'O4', 'O6'],
  closedCount: 2,
  openCount: 4,
  totalCount: 6,
  packageIsBound: false,
  qed: false,
};

export const IMP_95140_YTHAW_OBLIGATION_LEDGER = {
  id: 'imp-95140-ythaw-obligation-ledger',
  title:
    'y-thaw-01775943 six-obligation ledger O1-O6 at y = 0.1808: O3 (E_max budget) and O5 (site coverage) CLOSED, O1 (sharp-mass y-monotonicity), O2 (barrier/winding), O4 (analytic tail), O6 (criterion assembly) OPEN; 0.17759432 stays a package value, not a bound',
  ledger: YTHAW_OBLIGATION_LEDGER,
  summary: YTHAW_OBLIGATION_SUMMARY,
  note: 'formalization/y-thaw-01775943/SHARP_WEIGHT_NATIVE_BINDING.md; consolidates imp-95129, imp-95130, imp-95131, imp-95132, imp-95212',
};

// ── assertions (import-light; exact-literal consistency only) ───────────────
export const IMP_95140_ASSERTIONS = [
  {
    id: 'imp-95140-six-obligations-exhaustive',
    holds: () => YTHAW_OBLIGATION_LEDGER.length === 6,
    why: 'the y-thaw package ledger has exactly six obligations O1-O6, no more, no fewer.',
  },
  {
    id: 'imp-95140-closed-open-partition',
    holds: () => {
      const closed = YTHAW_OBLIGATION_LEDGER.filter((o) => o.status === 'CLOSED').map((o) => o.obligation);
      const open = YTHAW_OBLIGATION_LEDGER.filter((o) => o.status === 'OPEN').map((o) => o.obligation);
      const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));
      return (
        sameSet(closed, YTHAW_OBLIGATION_SUMMARY.closed) &&
        sameSet(open, YTHAW_OBLIGATION_SUMMARY.open) &&
        closed.length === YTHAW_OBLIGATION_SUMMARY.closedCount &&
        open.length === YTHAW_OBLIGATION_SUMMARY.openCount &&
        closed.length + open.length === YTHAW_OBLIGATION_SUMMARY.totalCount
      );
    },
    why: 'O3 and O5 must be exactly the CLOSED set; O1, O2, O4, O6 must be exactly the OPEN set (per imp-95212, imp-95130, imp-95129, imp-95131, imp-95132).',
  },
  {
    id: 'imp-95140-candidate-value-arithmetic',
    holds: () => {
      const t0 = 129 / 800;
      const y0 = 113 / 625;
      const computed = t0 + (y0 * y0) / 2;
      return (
        Math.abs(computed - YTHAW_OBLIGATION_SUMMARY.candidateValue) < 1e-12 &&
        Math.abs(y0 - YTHAW_OBLIGATION_SUMMARY.thawedFloorY) < 1e-12
      );
    },
    why: '0.17759432 = 129/800 + (113/625)^2/2 exactly at the thawed floor y = 0.1808; this is a package value, not a bound.',
  },
  {
    id: 'imp-95140-not-a-bound',
    holds: () =>
      YTHAW_OBLIGATION_SUMMARY.packageIsBound === false &&
      YTHAW_OBLIGATION_SUMMARY.qed === false &&
      YTHAW_OBLIGATION_SUMMARY.openCount > 0,
    why: 'with four obligations still open, the package cannot be claimed as a bound; no QED is asserted anywhere in this module.',
  },
];
