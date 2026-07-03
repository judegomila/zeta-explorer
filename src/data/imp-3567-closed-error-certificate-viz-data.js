/**
 * @module imp-3567-closed-error-certificate-viz-data
 * @fileoverview imp-3567 -- lightweight, import-light literal data for
 *   visualizing the imp-3532 closed error certificate against the exact
 *   moment-tail residual E_n(a) = R_n(a) - (a^n/n!)M_n, across the a-ladder
 *   {0.125, 0.25, 0.5} for each instantiated rung n = 0..4.
 *
 *   Each rung shows three curves vs. a: the exact residual tail |E_n(a)|
 *   (truncated at the highest available moment M6, imp-3481 ladder), the
 *   SHARP cosh(a T_A) bound, and the clean e^(a T_A) bound. On every rung and
 *   every a, tail <= sharp <= clean -- the certificate holds throughout.
 *
 *   Baked as literals from a one-off evaluation of imp-3532's exported
 *   `certified.cells` so importing this module into a page costs nothing at
 *   load time (imp-3532 itself pulls in the imp-3481 moment ladder module).
 *
 *   @see imp-3532-moment-tail-closed-error-bound.js (the certificate this visualizes)
 *   @see imp-3481-autocorrelation-moment-ladder.js (the measured moment ladder, T_A=6)
 *
 *   Ticket: imp-3567 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

export const IMP3567_SUPPORT_CAP_TA = 6;
export const IMP3567_A_LADDER = Object.freeze([0.125, 0.25, 0.5]);

// Per-rung n=0..4: three points (a, tail, sharp, clean), a ascending.
export const IMP3567_RUNGS = Object.freeze([
  {
    n: 0,
    points: Object.freeze([
      { a: 0.125, tail: 3.5448057329727046e-8, sharp: 4.589273960172453e-8, clean: 7.504146508194244e-8 },
      { a: 0.25, tail: 1.418039801002728e-7, sharp: 3.33544190109469e-7, clean: 6.354511313004463e-7 },
      { a: 0.5, tail: 5.674039872238425e-7, sharp: 0.000005709907228602015, clean: 0.000011391577559532675 },
    ]),
  },
  {
    n: 1,
    points: Object.freeze([
      { a: 0.125, tail: 1.9625186698422393e-10, sharp: 2.540782263092206e-10, clean: 4.1545574557394216e-10 },
      { a: 0.25, tail: 1.570122183018099e-9, sharp: 3.693234134820525e-9, clean: 7.0361585622549324e-9 },
      { a: 0.5, tail: 1.2564409372762636e-8, sharp: 1.2644815834693655e-7, clean: 2.522709994049882e-7 },
    ]),
  },
  {
    n: 2,
    points: Object.freeze([
      { a: 0.125, tail: 9.791563346684783e-13, sharp: 1.2676729200032092e-12, clean: 2.0728340471129806e-12 },
      { a: 0.25, tail: 1.5667406703312304e-11, sharp: 3.685331850707709e-11, clean: 7.021103539477596e-11 },
      { a: 0.5, tail: 2.507364495644625e-10, sharp: 2.523552032760267e-9, clean: 5.034624479134183e-9 },
    ]),
  },
  {
    n: 3,
    points: Object.freeze([
      { a: 0.125, tail: 4.468631012816149e-15, sharp: 5.785461877681627e-15, clean: 9.4600919283677e-15 },
      { a: 0.25, tail: 1.4299619241011677e-13, sharp: 3.3638561796873214e-13, clean: 6.408644726243792e-13 },
      { a: 0.5, tail: 4.575878157123737e-12, sharp: 4.606839461978424e-11, clean: 9.190896968091675e-11 },
    ]),
  },
  {
    n: 4,
    points: Object.freeze([
      { a: 0.125, tail: 1.886142951355486e-17, sharp: 2.441957751630999e-17, clean: 3.9929646593534433e-17 },
      { a: 0.25, tail: 1.207131488867511e-15, sharp: 2.8396677212748295e-15, clean: 5.4099880001184385e-15 },
      { a: 0.5, tail: 7.72564152875207e-14, sharp: 7.777914761201965e-13, clean: 1.5517365818106173e-12 },
    ]),
  },
]);

export const IMP3567_WORST_TAIL_OVER_SHARP = 0.7724110096141439; // worst slack of the sharp constant, all rungs/a
