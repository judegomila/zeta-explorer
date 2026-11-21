/**
 * @module imp-33323-min-node-lattice-jitter-band-viz-data
 *
 * imp-33323 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33296 min-node graded-GL lattice-jitter band. Presents the +/-2-panel
 * worst-in-window ULP scatter across the fully-resolved neighbourhood
 * (tau* > 6.2) for grade6 (panels in [155,235], anchor 171p) and grade5
 * (panels in [560,680], anchor 600p), against the strict <1 ULP bar and the
 * grade-independent ~[0.7,5] ULP robust band, marking every point that clears
 * the bar and the longest run of consecutive passing panel counts (1 for
 * grade6, 2 for grade5).
 *
 * Reference literals are baked from a direct re-run of the imp-33296
 * worst-in-window scorer against its own cluster gold (self-computing module)
 * -- no re-derivation of the underlying A(tau) kernel here.
 *
 * @see imp-33296-min-node-lattice-jitter-band.js (source module: JITTER neighbourhood stats)
 * @see imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js (the min-node hit)
 *
 * Ticket: imp-33323 (ux, low). Presentation only, RH-equivalent; imp-3066
 * untouched; no refereed bound is changed; NO QED.
 */

export const IMP33323_BAR = 1.0;
export const IMP33323_BAND = { floor: 0.7, ceiling: 5 };

export const IMP33323_GRADE6 = {
  grade: 6,
  lo: 155,
  hi: 235,
  anchor: 171,
  anchorUlp: 0.7627,
  longestPassRun: 1,
  passFraction: 0.122,
  rows: [
    [155, 2.2881, false], [157, 1.8029, false], [159, 3.3031, false], [161, 1.1102, false],
    [163, 1.202, false], [165, 4.1289, false], [167, 1.6516, false], [169, 2.1134, false],
    [171, 0.7627, true], [173, 2.2881, false], [175, 1.6516, false], [177, 3.3031, false],
    [179, 1.8029, false], [181, 1.5254, false], [183, 4.1289, false], [185, 2.4039, false],
    [187, 0.8747, true], [189, 2.4039, false], [191, 2.4773, false], [193, 1.8029, false],
    [195, 1.8029, false], [197, 1.6516, false], [199, 2.4773, false], [201, 1.4089, false],
    [203, 1.5254, false], [205, 1.4089, false], [207, 2.2881, false], [209, 1.952, false],
    [211, 0.8258, true], [213, 2.4773, false], [215, 1.4089, false], [217, 2.4773, false],
    [219, 1.4089, false], [221, 1.952, false], [223, 3.3031, false], [225, 2.1134, false],
    [227, 1.202, false], [229, 2.1134, false], [231, 0.8258, true], [233, 1.5254, false],
    [235, 0.9471, true],
  ],
};

export const IMP33323_GRADE5 = {
  grade: 5,
  lo: 560,
  hi: 680,
  anchor: 600,
  anchorUlp: 2.1134,
  longestPassRun: 2,
  passFraction: 0.115,
  rows: [
    [560, 0.8258, true], [562, 2.1134, false], [564, 1.6516, false], [566, 2.2881, false],
    [568, 3.3031, false], [570, 1.4089, false], [572, 1.952, false], [574, 0.8258, true],
    [576, 1.3013, false], [578, 3.3031, false], [580, 1.4089, false], [582, 2.1134, false],
    [584, 1.6516, false], [586, 1.6516, false], [588, 1.6516, false], [590, 0.8258, true],
    [592, 1.3013, false], [594, 2.4773, false], [596, 1.8029, false], [598, 3.3031, false],
    [600, 2.1134, false], [602, 1.4089, false], [604, 1.6516, false], [606, 1.6516, false],
    [608, 2.2881, false], [610, 2.1134, false], [612, 1.6516, false], [614, 3.8136, false],
    [616, 1.6516, false], [618, 4.9547, false], [620, 1.202, false], [622, 1.5254, false],
    [624, 1.3013, false], [626, 0.6714, true], [628, 0.7627, true], [630, 1.202, false],
    [632, 0.7045, true], [634, 1.6516, false], [636, 2.1134, false], [638, 1.1102, false],
    [640, 2.4773, false], [642, 0.8258, true], [644, 1.6516, false], [646, 2.4773, false],
    [648, 4.1289, false], [650, 2.8179, false], [652, 1.6516, false], [654, 1.8029, false],
    [656, 4.1289, false], [658, 2.4773, false], [660, 1.6516, false], [662, 1.4089, false],
    [664, 1.3013, false], [666, 1.3428, false], [668, 4.1289, false], [670, 1.4089, false],
    [672, 1.5254, false], [674, 2.4773, false], [676, 1.5254, false], [678, 1.4089, false],
    [680, 1.6516, false],
  ],
};
