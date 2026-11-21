/**
 * @module imp-33609-graded-mapped-cc-abscissa-artifact-viz-data
 *
 * imp-33609 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33580 graded-mapped Clenshaw-Curtis flat-budget artifact. Presents, for
 * the deeper deep-tail rungs n in {350,375,400}, the inner-node budget needed
 * to clear the imp-33316 &lt; 64 ULP band by two single-grid CC routes: the
 * imp-33560 UNMAPPED control (linear map s = (hi/2)(1+x), which CLIMBS 257 ->
 * 257 -> 513 nodes) and the GRADED-MAPPED test (origin-concentrating map
 * s = hi t^4 composed onto the SAME Chebyshev-Lobatto nodes, which FLATTENS to
 * 129 -> 97 -> 129 nodes) -- alongside the per-rung worst-window ULP each
 * route actually reaches at its min-node grid.
 *
 * Reference literals are baked from a direct re-run of the imp-33580
 * self-computing rungTable (node budgets + ULPs + mapSavingFactor) -- no
 * re-derivation of the underlying A(tau) kernel or quadrature rules here.
 *
 * @see imp-33580-graded-mapped-cc-abscissa-artifact.js (source module: the artifact test)
 * @see imp-33560-deep-tail-graded-vs-cc-cross-solver-node-budget.js (the climbing-budget attribution tested)
 * @see imp-33539-graded-plateau-deeper-tail-min-budget.js (the flat ~200-node graded-GL plateau reference)
 *
 * Ticket: imp-33609 (ux, medium). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP33609_BAND_ULP = 64;
export const IMP33609_GRADED_PLATEAU_NODES = 200;
export const IMP33609_MAX_MAP_SAVING_FACTOR = 3.9767441860465116;

export const IMP33609_RUNG_TABLE = [
  {
    n: 350,
    unmappedNodes: 257,
    unmappedUlp: 19.659174707295463,
    mappedNodes: 129,
    mappedUlp: 35.84908328977408,
    mapSavingFactor: 1.9922480620155039,
  },
  {
    n: 375,
    unmappedNodes: 257,
    unmappedUlp: 22.81416433547438,
    mappedNodes: 97,
    mappedUlp: 19.889271471952025,
    mapSavingFactor: 2.649484536082474,
  },
  {
    n: 400,
    unmappedNodes: 513,
    unmappedUlp: 35.000632401027616,
    mappedNodes: 129,
    mappedUlp: 31.667238839024982,
    mapSavingFactor: 3.9767441860465116,
  },
];
