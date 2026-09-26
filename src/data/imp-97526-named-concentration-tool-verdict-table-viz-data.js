/**
 * @module imp-97526-named-concentration-tool-verdict-table-viz-data
 *
 * imp-97526 (content): import-light viz-data leaf charting the imp-97502
 * tool-by-tool verdict table for the four named band-limited concentration
 * inequalities assessed against the shared de Branges coercivity primitive
 * at 2a = ln3 (Donoho-Stark, Amrein-Berthier / Nazarov, Nazarov /
 * Turan-Nazarov reverse-Holder, Paneah / Logvinenko-Sereda). Presents the
 * time-bandwidth product TBW = 15.15, and per-tool Wall A (depth) / Wall B
 * (sign-weight) failure columns, none previously tabulated as a standalone
 * chart.
 *
 * PRESENTATION ONLY. All rows and constants are reused verbatim from
 * imp-97502. Establishes no operator positivity; changes no bound;
 * interval-rigorous reach stays 2a<=0.96; Platt-Trudgian Lambda<=0.2 remains
 * SOTA; RH open; NO QED.
 *
 * @see imp-97502-krein-named-concentration-inequality-assessment.js (the source verdict, conversion data, and per-tool booleans)
 *
 * Ticket: imp-97526 (content, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP97502_CONVERSION,
  IMP97502_WELL,
  IMP97502_VERDICT,
} from './imp-97502-krein-named-concentration-inequality-assessment.js';

export const IMP97526_TBW = IMP97502_CONVERSION.timeBandwidthProduct_freqBand; // 15.15
export const IMP97526_TBW_ANGULAR = IMP97502_CONVERSION.timeBandwidthProduct_angular; // 2.41
export const IMP97526_DEPTH = IMP97502_CONVERSION.depth; // 4336.198
export const IMP97526_THETA_CEILING = IMP97502_CONVERSION.thetaCeilingForCoercivity_c_half; // 1.153e-4

// One row per named tool from imp-97502: does it fall to Wall A (depth
// dominates any mass-fraction ceiling) and/or Wall B (bounds an indicator /
// Lebesgue mass, never the signed sigma_2 weight)? All four fall to both,
// each for a tool-specific reason recorded in `regime`.
export const IMP97526_TOOL_TABLE = Object.freeze([
  Object.freeze({
    tool: 'Donoho-Stark support-size',
    regime: 'vacuous: |T||W|=15.15 (or 2.41 in 2pi convention) exceeds the non-triviality threshold 1',
    wallA: true,
    wallB: true,
    verdict: 'places no ceiling on theta at all',
  }),
  Object.freeze({
    tool: 'Amrein-Berthier / Nazarov (annihilation)',
    regime: 'quantitative constant exp(-C2*15.15) astronomically small',
    wallA: true,
    wallB: true,
    verdict: 'theta_max indistinguishable from 1 at any working precision',
  }),
  Object.freeze({
    tool: 'Nazarov / Turan-Nazarov reverse-Holder',
    regime: '(geometric-ratio)^{C*band*|E|} multiplier enormous at band=ln3',
    wallA: true,
    wallB: true,
    verdict: 'theta_max -> 1 with no usable margin',
  }),
  Object.freeze({
    tool: 'Paneah / Logvinenko-Sereda relative-measure',
    regime: 'wrong direction (lower-bounds mass on the thick set); gamma exponentially small in band*window',
    wallA: true,
    wallB: true,
    verdict: 'theta <= 1-gamma with gamma ~ 0',
  }),
]);

export const IMP97526_VERDICT = Object.freeze({
  ticket: 'imp-97526',
  sourceTicket: 'imp-97502',
  claim:
    'charts the imp-97502 tool-by-tool verdict table at 2a=ln3: all four named band-limited concentration ' +
    'inequalities (Donoho-Stark, Amrein-Berthier/Nazarov, Nazarov/Turan-Nazarov reverse-Holder, ' +
    'Paneah/Logvinenko-Sereda) fall to both Wall A (depth 4336.198 dominates any mass-fraction ceiling, ' +
    'needing theta_max < 1.153e-4) and Wall B (each bounds an indicator/Lebesgue mass, never the signed ' +
    'sigma_2 weight), governed by the time-bandwidth product TBW = |E|*2a = 15.15.',
  rowsReusedVerbatim: true,
  operatorPositivityProved: false,
  boundMoves: false,
  qed: false,
});
export default IMP97526_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97526_ASSERTIONS = [
  {
    id: 'imp97526-tbw-matches-imp97502',
    holds: () =>
      Math.abs(IMP97526_TBW - IMP97502_WELL.measureE * Math.log(3)) < 1e-9 &&
      IMP97526_TBW > 15 && IMP97526_TBW < 16 &&
      IMP97526_TBW_ANGULAR > 2 && IMP97526_TBW_ANGULAR < 3,
    why: 'the charted time-bandwidth product must equal the imp-97502 conversion datum |E|*2a=15.15 (or 2.41 in the 2pi convention) exactly.',
  },
  {
    id: 'imp97526-four-rows-all-wallA-and-wallB',
    holds: () =>
      IMP97526_TOOL_TABLE.length === 4 &&
      IMP97526_TOOL_TABLE.every((r) => r.wallA === true && r.wallB === true) &&
      IMP97526_TOOL_TABLE.every((r) => Object.isFrozen(r)) &&
      Object.isFrozen(IMP97526_TOOL_TABLE),
    why: 'the table must have exactly the four named tools assessed by imp-97502, every one failing both Wall A and Wall B, matching the source verdict that no named tool supplies a positive lower bound.',
  },
  {
    id: 'imp97526-theta-ceiling-matches-imp97502',
    holds: () =>
      Math.abs(IMP97526_THETA_CEILING - 0.5 / IMP97526_DEPTH) < 1e-12 &&
      IMP97526_THETA_CEILING < 2e-4,
    why: 'the charted Wall A theta ceiling (needed for a usable c~0.5) must reproduce the imp-97502 value 1.153e-4 = 0.5/4336.198.',
  },
  {
    id: 'imp97526-measurement-only-no-qed',
    holds: () =>
      IMP97526_VERDICT.rowsReusedVerbatim === true &&
      IMP97526_VERDICT.operatorPositivityProved === false &&
      IMP97526_VERDICT.boundMoves === false &&
      IMP97526_VERDICT.qed === false &&
      IMP97502_VERDICT.qed === false &&
      IMP97502_VERDICT.anyNamedToolSuppliesC === false,
    why: 'presentation only: rows and constants reused verbatim from imp-97502; no operator positivity; no bound moves; NO QED.',
  },
];

for (const t of IMP97526_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97526-named-concentration-tool-verdict-table-viz-data assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
