/**
 * @module imp-33285-watson-bracket-direct-vs-reform-dd-ladder-viz-data
 *
 * imp-33285 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33248 Watson-bracket direct-vs-reform+double-double ladder across
 * tau in {3, 4, 5, 6}. imp-33248 measured two reconstruction routes of the
 * imp-33208 bracket(tau) remainder against the imp-3892 closed two-term model
 * rhoRatio -> K_lead + K6 e^{-2 tau}: the DIRECT single-double route
 * (bracket = exp(lnAn1 + T - ln(Phi0/4))) suffers catastrophic cancellation of
 * magnitudes ~pi e^{4 tau} and diverges past the tau ~ 3.5 imp-3730 floor
 * (-3.53, -389, -2.3e6 at tau=4,5,6), while the CANCELLATION-FREE
 * reformulation (folding the -T subtraction analytically per node, then
 * accumulating in double-double) recovers a genuine signal that tracks the
 * closed model to ~5.9e-8 / ~5.0e-6 / ~1.0e-4.
 *
 * Reference literals are baked from the imp-33248 measured rows -- no
 * re-derivation here.
 *
 * @see imp-33248-dd-watson-bracket-high-tau-run.js (source module: rows, constants)
 *
 * Ticket: imp-33285 (ux, low). Presentation only, RH-free; operator positivity
 * (imp-3066 K_a >= 0) untouched; NO QED.
 */

export const IMP33285_K0 = 3.46; // imp-3730 gate on |rhoRatio|
export const IMP33285_K_LEAD = -3.41205704310674; // imp-3892 closed leading coefficient

export const IMP33285_CROSS_CHECK = {
  tau: 3.0,
  direct: -3.4068664563494875,
  reformDD: -3.4068305171569877,
  note: 'Reliable window: both routes reproduce the imp-33208 rhoRatio(3) ~ -3.4069 to ~2.7e-4.',
};

export const IMP33285_LADDER = [
  {
    tau: 4.0,
    model: -3.411350356842794,
    direct: -3.531211255752523,
    reformDD: -3.411350298082203,
    diffModel: 5.87605910595812e-8,
    ddMinusPlain: 0,
  },
  {
    tau: 5.0,
    model: -3.4119614035210493,
    direct: -389.03584111947,
    reformDD: -3.411966425337427,
    diffModel: 5.021816377848154e-6,
    ddMinusPlain: 0,
  },
  {
    tau: 6.0,
    model: -3.4120440996963217,
    direct: -2307494.756781694,
    reformDD: -3.4119422571824742,
    diffModel: 1.0184251384748322e-4,
    ddMinusPlain: 7.058119989755696e-5,
  },
];

export const IMP33285_ALL_TAU = [IMP33285_CROSS_CHECK, ...IMP33285_LADDER];
