/**
 * @fileoverview imp-97512 -- citable read-guard note for the imp-97484 (and imp-97456) lam_min(N,T)
 * table for the Krein c_sharp = lambda_min(P_a M_sigma2 P_a) upper bracket at 2a = ln3.
 *
 * THE GUARD. Each fixed-N row of the table is monotone INCREASING in T: cumulative-T quadrature resolves
 * the inner limit from below, so a small-T cell is UNDER-resolved and reads spuriously LOW. The valid
 * directly-read bracket at a given N is therefore the LARGEST-T (most-resolved) cell of that row's
 * window -- e.g. IMP97484_BEST_BRACKET = 0.578574 at (N=164, T=8000) -- NOT the global minimum taken over
 * every (N,T) cell in the table. Reading the global min would instead land on the LEAST-resolved cell in
 * the whole table, (N=164, T=4800) = 0.576636, which is not a tighter bracket at all, just an artifact of
 * under-resolution.
 *
 * WHY A NOTE (not a re-derivation). imp-97484 already states this guard inline (its FINDING 2 and the
 * IMP97484_BEST_BRACKET.note field) and its own self-executing assertions establish every flag re-exported
 * below. This module only lifts the guard into its own citable, import-light leaf so future consumers of
 * the table (glossary entries, cohort-index notes, viz captions) can @see one small file instead of the
 * full imp-97484 fileoverview.
 *
 * Measurement/documentation only: establishes nothing new; the bracket stays an UPPER bracket on
 * lambda_min, not interval-certified, not a positive lower bound; no bound moves; interval-rigorous reach
 * stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97484-krein-csharp-nscaled-tgrid-extended.js (source table, FINDING 2, and IMP97484_BEST_BRACKET.note)
 * @see imp-97456-krein-csharp-nscaled-tgrid.js (the N=84..132 well-resolved table this note also covers)
 *
 * Ticket: imp-97512 (content, low, sonnet-4-6). Documentation only; NO QED; no refereed bound is changed.
 */

import {
  IMP97484_LAM_TABLE,
  IMP97484_BEST_BRACKET,
  IMP97484_RESOLVED_COLUMNS,
  IMP97484_N_ROWS,
  IMP97484_VERDICT,
} from './imp-97484-krein-csharp-nscaled-tgrid-extended.js';

export const IMP97512_READ_GUARD = Object.freeze({
  ticket: 'imp-97512',
  sourceTicket: 'imp-97484',
  rule: 'the valid directly-read c_sharp bracket at a given N is the LARGEST-T (most-resolved) cell, NOT the global minimum over all (N,T) cells',
  why: 'each fixed-N row is monotone increasing in T, so small-T cells are under-resolved and read spuriously low',
  validBracket: Object.freeze({ N: IMP97484_BEST_BRACKET.atN, T: IMP97484_BEST_BRACKET.atT, value: IMP97484_BEST_BRACKET.value }),
  invalidGlobalMinCell: Object.freeze({ ...IMP97484_BEST_BRACKET.underResolvedMinCell }),
  isUpperBracket: true,
  intervalCertified: false,
  positiveLowerBound: false,
  boundMoves: false,
  qed: false,
});

export const IMP97512_BANNER =
  'Read guard for the imp-97484/imp-97456 lam_min(N,T) table: the citable c_sharp upper bracket is the ' +
  'LARGEST-T cell of a row (0.578574 at N=164, T=8000), never the global minimum over all cells -- the ' +
  'global-min cell (0.576636 at N=164, T=4800) is merely the LEAST-resolved reading in the table, since ' +
  'each row increases monotonically with T. No bound moves; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97512_ASSERTIONS = [
  {
    id: 'imp97512-valid-bracket-matches-imp97484-best',
    holds: () =>
      IMP97512_READ_GUARD.validBracket.value === IMP97484_BEST_BRACKET.value &&
      IMP97512_READ_GUARD.validBracket.N === IMP97484_BEST_BRACKET.atN &&
      IMP97512_READ_GUARD.validBracket.T === IMP97484_BEST_BRACKET.atT &&
      IMP97484_LAM_TABLE[`${IMP97512_READ_GUARD.validBracket.N},${IMP97512_READ_GUARD.validBracket.T}`] === IMP97512_READ_GUARD.validBracket.value,
    why: 'the read-guard must cite the same directly-read bracket imp-97484 established, not a re-derivation.',
  },
  {
    id: 'imp97512-global-min-cell-is-the-under-resolved-artifact-not-the-bracket',
    holds: () => {
      let globalMin = Infinity;
      let globalMinKey = null;
      for (const N of IMP97484_N_ROWS) {
        for (const T of IMP97484_RESOLVED_COLUMNS) {
          const v = IMP97484_LAM_TABLE[`${N},${T}`];
          if (v < globalMin) {
            globalMin = v;
            globalMinKey = { N, T, value: v };
          }
        }
      }
      return (
        globalMinKey.N === IMP97512_READ_GUARD.invalidGlobalMinCell.N &&
        globalMinKey.T === IMP97512_READ_GUARD.invalidGlobalMinCell.T &&
        Math.abs(globalMinKey.value - IMP97512_READ_GUARD.invalidGlobalMinCell.value) < 1e-9 &&
        globalMinKey.value < IMP97512_READ_GUARD.validBracket.value
      );
    },
    why: 'the actual global minimum over the table is the under-resolved small-T cell, strictly below the valid largest-T bracket -- confirming the guard is necessary, not vacuous.',
  },
  {
    id: 'imp97512-honesty-gate-no-qed',
    holds: () =>
      IMP97512_READ_GUARD.isUpperBracket === true &&
      IMP97512_READ_GUARD.intervalCertified === false &&
      IMP97512_READ_GUARD.positiveLowerBound === false &&
      IMP97512_READ_GUARD.boundMoves === false &&
      IMP97512_READ_GUARD.qed === false &&
      IMP97484_VERDICT.qed === false &&
      /NO QED/.test(IMP97512_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED.',
  },
];

for (const assertion of IMP97512_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97512-lam-min-nt-read-guard assertion failed: ${assertion.id}`);
  }
}

export default { readGuard: IMP97512_READ_GUARD, banner: IMP97512_BANNER };
