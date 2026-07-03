/**
 * @module imp-3863-gap-structure-function-s2-viz-data
 *
 * Thin viz-data wrapper around imp-3734: reshapes the raw/unfolded S_2(r) tables into
 * plot-ready {r, v} points plus the reference constants the imp-3863 chart needs
 * (large-r plateaus, lag-1 autocorrelations, 2*var targets). No new computation.
 */

import { IMP3734_GAP_STRUCTURE_FUNCTION_S2 } from './imp-3734-gap-structure-function-s2.js';

const { field, s2Raw, s2Unfolded, plateauRaw, plateauUnfolded, lag1AutocorrelationRaw, lag1AutocorrelationUnfolded } =
  IMP3734_GAP_STRUCTURE_FUNCTION_S2;

export const IMP3863_S2_RAW_POINTS = s2Raw.map(([r, v]) => ({ r, v }));
export const IMP3863_S2_UNFOLDED_POINTS = s2Unfolded.map(([r, v]) => ({ r, v }));

export const IMP3863_PLATEAU_RAW = plateauRaw;
export const IMP3863_PLATEAU_UNFOLDED = plateauUnfolded;
export const IMP3863_TWO_VAR_RAW = field.twoVarGap;
export const IMP3863_TWO_VAR_UNFOLDED = field.twoVarUnfolded;
export const IMP3863_C_RAW_1 = lag1AutocorrelationRaw;
export const IMP3863_C_UNFOLDED_1 = lag1AutocorrelationUnfolded;
