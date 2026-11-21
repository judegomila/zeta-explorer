/**
 * @module imp-95658-eflow-inversion-contour-surface-viz-data
 * @fileoverview imp-95658 (numerical) -- import-light, baked-literal viz-data for a future
 *   E_flow-attribution chart of the imp-95639 inversion surface. Reproduces the imp-95639
 *   (includeFlow=true vs includeFlow=false) gap = log10 N_knee - log10 N_cross surfaces over the
 *   [0.5x, 1.5x] x [0.5x, 1.5x] (C_C, E_trunc) multiplier box at a render-friendly 21x21 grid,
 *   plus the two gap = 0 inversion contours. With the absolute additive E_flow term (imp-398)
 *   ON the box-min gap is ~ -0.00468 (inverting, low-C_C / high-E_trunc corner); with E_flow = 0
 *   the box-min gap rises to ~ +0.01708 (strictly positive, opposite corner) and the gap = 0
 *   contour leaves the [0.1x, 1.5x] search window -- so the imp-95617 wedge is ~100% E_flow-driven.
 *
 *   ALL grids/contours/scalars below are baked reference LITERALS emitted from a one-off run of the
 *   exact imp-95639 model (byte-for-byte sub-terms: E_coll = C_C sqrt(L/N), E_flow =
 *   C_F (L/T0) Gronwall with C_F = (log(T0/2pi)+1)/2pi, E_trunc = 3.06e-5, knee at
 *   p double-prime(ln N) = 0, crossover at r = E_coll/E_trunc = 1). This module runs NO knee/crossover
 *   quadrature at import and does NOT import the ~16.7MB zeros bundle, so a page can import it for free.
 *
 *   Presentation/measurement only. NOT an RH bound; the component model is the inherited
 *   imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound; imp-3066
 *   K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-95639-eflow-zero-inversion-wedge.js (source model: the on/off sweep this bakes)
 *   @see imp-95617-transition-knee-ordering-joint-2d.js (the joint sweep WITH E_flow)
 *   @see imp-398 (E_flow = C_F (log T0 / T0) Gronwall absolute additive term)
 *   Ticket: imp-95658 (numerical, medium). Baked viz-data for a future chart.
 */

// Shared multiplier axis for both surfaces (C_C mult on axis 0, E_trunc mult on axis 1).
export const IMP95658_AXIS_MULTS = Object.freeze([0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1, 1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4, 1.45, 1.5]);
// E_trunc multiplier samples at which each gap = 0 contour is located.
export const IMP95658_CONTOUR_E_MULTS = Object.freeze([0.5, 0.5833, 0.6667, 0.75, 0.8333, 0.9167, 1, 1.0833, 1.1667, 1.25, 1.3333, 1.4167, 1.5]);

// gap[i][j] = log10 N_knee - log10 N_cross at (C_C = C_C_PINNED * AXIS[i], E_trunc = 3.06e-5 * AXIS[j]).
// includeFlow = true (reproduces the imp-95617 / imp-95639 WITH-E_flow surface).
export const IMP95658_GAP_SURFACE_WITH_FLOW = Object.freeze([
    [0.005872, 0.005229, 0.004611, 0.004007, 0.003399, 0.002823, 0.002251, 0.001691, 0.001138, 0.000601, 0.000071, -0.000437, -0.000946, -0.001451, -0.001929, -0.002407, -0.002875, -0.003341, -0.003798, -0.004236, -0.004682],
    [0.007705, 0.007197, 0.006688, 0.006199, 0.005713, 0.005246, 0.004768, 0.004322, 0.003864, 0.003428, 0.002997, 0.002569, 0.002136, 0.001735, 0.001327, 0.000926, 0.000532, 0.000154, -0.000243, -0.000602, -0.000979],
    [0.009101, 0.008707, 0.008283, 0.007892, 0.007515, 0.007104, 0.006722, 0.006362, 0.005991, 0.005625, 0.005261, 0.004913, 0.004563, 0.004214, 0.003870, 0.003545, 0.003202, 0.002897, 0.002565, 0.002256, 0.001946],
    [0.010199, 0.009856, 0.009560, 0.009229, 0.008907, 0.008596, 0.008279, 0.007957, 0.007669, 0.007359, 0.007045, 0.006752, 0.006466, 0.006176, 0.005909, 0.005625, 0.005348, 0.005064, 0.004802, 0.004516, 0.004262],
    [0.011059, 0.010785, 0.010541, 0.010272, 0.010027, 0.009765, 0.009509, 0.009252, 0.009006, 0.008747, 0.008512, 0.008252, 0.008003, 0.007762, 0.007525, 0.007280, 0.007057, 0.006817, 0.006590, 0.006378, 0.006147],
    [0.011755, 0.011551, 0.011354, 0.011138, 0.010921, 0.010710, 0.010505, 0.010305, 0.010090, 0.009864, 0.009671, 0.009481, 0.009254, 0.009057, 0.008861, 0.008662, 0.008453, 0.008276, 0.008075, 0.007890, 0.007686],
    [0.012323, 0.012149, 0.011991, 0.011837, 0.011654, 0.011496, 0.011324, 0.011148, 0.010985, 0.010808, 0.010634, 0.010462, 0.010299, 0.010135, 0.009956, 0.009786, 0.009622, 0.009451, 0.009286, 0.009134, 0.008958],
    [0.012767, 0.012650, 0.012527, 0.012397, 0.012267, 0.012143, 0.011998, 0.011863, 0.011708, 0.011581, 0.011436, 0.011289, 0.011146, 0.011015, 0.010872, 0.010722, 0.010587, 0.010445, 0.010310, 0.010177, 0.010043],
    [0.013158, 0.013059, 0.012985, 0.012884, 0.012779, 0.012667, 0.012552, 0.012456, 0.012335, 0.012218, 0.012100, 0.011982, 0.011864, 0.011769, 0.011631, 0.011521, 0.011398, 0.011283, 0.011166, 0.011050, 0.010936],
    [0.013478, 0.013413, 0.013359, 0.013280, 0.013195, 0.013119, 0.013033, 0.012946, 0.012853, 0.012767, 0.012673, 0.012583, 0.012485, 0.012382, 0.012289, 0.012181, 0.012077, 0.012002, 0.011871, 0.011791, 0.011681],
    [0.013731, 0.013701, 0.013658, 0.013605, 0.013542, 0.013492, 0.013426, 0.013362, 0.013285, 0.013229, 0.013150, 0.013067, 0.012989, 0.012916, 0.012829, 0.012758, 0.012662, 0.012599, 0.012502, 0.012438, 0.012344],
    [0.013940, 0.013925, 0.013914, 0.013889, 0.013851, 0.013805, 0.013760, 0.013712, 0.013667, 0.013614, 0.013550, 0.013490, 0.013437, 0.013362, 0.013323, 0.013245, 0.013178, 0.013110, 0.013039, 0.012971, 0.012911],
    [0.014128, 0.014142, 0.014132, 0.014118, 0.014107, 0.014085, 0.014041, 0.014021, 0.013979, 0.013929, 0.013902, 0.013853, 0.013805, 0.013761, 0.013708, 0.013655, 0.013608, 0.013551, 0.013495, 0.013441, 0.013378],
    [0.014280, 0.014305, 0.014315, 0.014320, 0.014326, 0.014310, 0.014296, 0.014278, 0.014255, 0.014230, 0.014197, 0.014170, 0.014129, 0.014089, 0.014067, 0.014026, 0.013974, 0.013949, 0.013894, 0.013861, 0.013802],
    [0.014403, 0.014456, 0.014476, 0.014494, 0.014502, 0.014502, 0.014501, 0.014499, 0.014488, 0.014487, 0.014458, 0.014442, 0.014415, 0.014407, 0.014370, 0.014339, 0.014300, 0.014263, 0.014226, 0.014195, 0.014169],
    [0.014515, 0.014572, 0.014601, 0.014644, 0.014655, 0.014678, 0.014693, 0.014691, 0.014693, 0.014692, 0.014673, 0.014670, 0.014660, 0.014642, 0.014634, 0.014602, 0.014591, 0.014568, 0.014536, 0.014501, 0.014490],
    [0.014601, 0.014674, 0.014730, 0.014758, 0.014800, 0.014812, 0.014832, 0.014861, 0.014865, 0.014871, 0.014876, 0.014880, 0.014864, 0.014864, 0.014847, 0.014840, 0.014840, 0.014827, 0.014804, 0.014784, 0.014764],
    [0.014677, 0.014750, 0.014804, 0.014857, 0.014912, 0.014948, 0.014972, 0.015004, 0.015015, 0.015039, 0.015040, 0.015050, 0.015046, 0.015060, 0.015053, 0.015049, 0.015050, 0.015034, 0.015030, 0.015020, 0.015004],
    [0.014741, 0.014839, 0.014902, 0.014955, 0.015014, 0.015050, 0.015092, 0.015123, 0.015144, 0.015168, 0.015183, 0.015203, 0.015217, 0.015210, 0.015229, 0.015230, 0.015228, 0.015228, 0.015244, 0.015227, 0.015218],
    [0.014784, 0.014895, 0.014974, 0.015032, 0.015086, 0.015147, 0.015193, 0.015225, 0.015254, 0.015291, 0.015309, 0.015333, 0.015349, 0.015372, 0.015384, 0.015388, 0.015390, 0.015408, 0.015407, 0.015416, 0.015413],
    [0.014843, 0.014942, 0.015025, 0.015095, 0.015167, 0.015228, 0.015266, 0.015319, 0.015346, 0.015392, 0.015421, 0.015445, 0.015477, 0.015499, 0.015522, 0.015526, 0.015539, 0.015556, 0.015555, 0.015575, 0.015588],
].map((r) => Object.freeze(r)));

// includeFlow = false (E_flow identically zero -- pure E_coll/E_trunc balance surface).
export const IMP95658_GAP_SURFACE_EFLOW_ZERO = Object.freeze([
    [0.020465, 0.020807, 0.021123, 0.021423, 0.021712, 0.021961, 0.022226, 0.022456, 0.022699, 0.022916, 0.023139, 0.023345, 0.023543, 0.023733, 0.023922, 0.024108, 0.024295, 0.024448, 0.024621, 0.024783, 0.024954],
    [0.020126, 0.020462, 0.020772, 0.021068, 0.021344, 0.021599, 0.021843, 0.022089, 0.022310, 0.022533, 0.022749, 0.022947, 0.023140, 0.023328, 0.023504, 0.023693, 0.023870, 0.024028, 0.024188, 0.024351, 0.024501],
    [0.019843, 0.020162, 0.020465, 0.020752, 0.021015, 0.021280, 0.021519, 0.021742, 0.021960, 0.022175, 0.022386, 0.022587, 0.022777, 0.022946, 0.023133, 0.023305, 0.023486, 0.023634, 0.023808, 0.023962, 0.024114],
    [0.019561, 0.019884, 0.020177, 0.020462, 0.020725, 0.020975, 0.021208, 0.021433, 0.021660, 0.021866, 0.022063, 0.022262, 0.022431, 0.022633, 0.022802, 0.022972, 0.023139, 0.023304, 0.023463, 0.023606, 0.023755],
    [0.019325, 0.019625, 0.019923, 0.020204, 0.020454, 0.020714, 0.020937, 0.021163, 0.021382, 0.021578, 0.021777, 0.021979, 0.022161, 0.022323, 0.022502, 0.022666, 0.022828, 0.022991, 0.023140, 0.023291, 0.023434],
    [0.019093, 0.019406, 0.019691, 0.019968, 0.020223, 0.020471, 0.020693, 0.020905, 0.021121, 0.021315, 0.021512, 0.021706, 0.021881, 0.022068, 0.022217, 0.022390, 0.022548, 0.022703, 0.022852, 0.023001, 0.023139],
    [0.018894, 0.019199, 0.019479, 0.019747, 0.019995, 0.020239, 0.020462, 0.020675, 0.020889, 0.021083, 0.021274, 0.021437, 0.021632, 0.021794, 0.021969, 0.022128, 0.022289, 0.022436, 0.022573, 0.022723, 0.022861],
    [0.018710, 0.019014, 0.019292, 0.019538, 0.019788, 0.020029, 0.020245, 0.020463, 0.020663, 0.020868, 0.021041, 0.021229, 0.021398, 0.021570, 0.021743, 0.021883, 0.022037, 0.022197, 0.022340, 0.022471, 0.022623],
    [0.018528, 0.018827, 0.019102, 0.019359, 0.019609, 0.019834, 0.020057, 0.020269, 0.020462, 0.020655, 0.020858, 0.021021, 0.021189, 0.021372, 0.021520, 0.021670, 0.021827, 0.021960, 0.022110, 0.022255, 0.022377],
    [0.018368, 0.018668, 0.018923, 0.019198, 0.019422, 0.019650, 0.019867, 0.020071, 0.020273, 0.020458, 0.020648, 0.020831, 0.020984, 0.021144, 0.021313, 0.021470, 0.021617, 0.021755, 0.021898, 0.022038, 0.022169],
    [0.018217, 0.018508, 0.018765, 0.019026, 0.019275, 0.019494, 0.019697, 0.019897, 0.020092, 0.020290, 0.020465, 0.020642, 0.020807, 0.020970, 0.021123, 0.021278, 0.021423, 0.021554, 0.021712, 0.021833, 0.021961],
    [0.018075, 0.018353, 0.018618, 0.018872, 0.019099, 0.019326, 0.019535, 0.019737, 0.019924, 0.020120, 0.020283, 0.020463, 0.020636, 0.020788, 0.020937, 0.021104, 0.021239, 0.021382, 0.021509, 0.021648, 0.021780],
    [0.017946, 0.018224, 0.018484, 0.018716, 0.018953, 0.019175, 0.019384, 0.019575, 0.019768, 0.019946, 0.020126, 0.020297, 0.020462, 0.020626, 0.020772, 0.020924, 0.021068, 0.021202, 0.021344, 0.021467, 0.021599],
    [0.017813, 0.018092, 0.018345, 0.018595, 0.018805, 0.019040, 0.019246, 0.019437, 0.019626, 0.019802, 0.019975, 0.020145, 0.020312, 0.020472, 0.020617, 0.020755, 0.020896, 0.021047, 0.021172, 0.021312, 0.021443],
    [0.017684, 0.017962, 0.018231, 0.018460, 0.018683, 0.018893, 0.019099, 0.019301, 0.019490, 0.019658, 0.019843, 0.020006, 0.020162, 0.020310, 0.020465, 0.020604, 0.020752, 0.020887, 0.021015, 0.021153, 0.021280],
    [0.017567, 0.017828, 0.018089, 0.018331, 0.018556, 0.018786, 0.018963, 0.019169, 0.019345, 0.019524, 0.019697, 0.019852, 0.020030, 0.020179, 0.020313, 0.020461, 0.020597, 0.020739, 0.020869, 0.021001, 0.021124],
    [0.017463, 0.017722, 0.017985, 0.018209, 0.018434, 0.018648, 0.018849, 0.019043, 0.019230, 0.019401, 0.019561, 0.019726, 0.019884, 0.020030, 0.020177, 0.020321, 0.020462, 0.020591, 0.020725, 0.020846, 0.020975],
    [0.017357, 0.017616, 0.017871, 0.018105, 0.018326, 0.018539, 0.018735, 0.018926, 0.019118, 0.019280, 0.019449, 0.019598, 0.019759, 0.019911, 0.020046, 0.020196, 0.020319, 0.020460, 0.020594, 0.020708, 0.020842],
    [0.017247, 0.017516, 0.017776, 0.018004, 0.018216, 0.018420, 0.018618, 0.018807, 0.018979, 0.019164, 0.019325, 0.019479, 0.019625, 0.019780, 0.019923, 0.020062, 0.020204, 0.020330, 0.020454, 0.020587, 0.020714],
    [0.017155, 0.017421, 0.017668, 0.017890, 0.018105, 0.018315, 0.018513, 0.018700, 0.018883, 0.019044, 0.019212, 0.019372, 0.019512, 0.019663, 0.019817, 0.019948, 0.020078, 0.020199, 0.020337, 0.020462, 0.020583],
    [0.017076, 0.017322, 0.017575, 0.017804, 0.018015, 0.018213, 0.018412, 0.018604, 0.018770, 0.018938, 0.019093, 0.019255, 0.019406, 0.019546, 0.019691, 0.019835, 0.019968, 0.020086, 0.020223, 0.020336, 0.020471],
].map((r) => Object.freeze(r)));

// gap = 0 inversion contour C_C_invert(E_trunc), bisection floor-clamped to 0.1x (WITH E_flow: rises
// ~0.399 -> 0.565 inside the box).
export const IMP95658_CONTOUR_WITH_FLOW = Object.freeze([
  { eTrunc_mult: 0.5, cC_invert_mult: 0.39869, clampedToFloor: false },
  { eTrunc_mult: 0.5833, cC_invert_mult: 0.41947, clampedToFloor: false },
  { eTrunc_mult: 0.6667, cC_invert_mult: 0.43822, clampedToFloor: false },
  { eTrunc_mult: 0.75, cC_invert_mult: 0.45512, clampedToFloor: false },
  { eTrunc_mult: 0.8333, cC_invert_mult: 0.47068, clampedToFloor: false },
  { eTrunc_mult: 0.9167, cC_invert_mult: 0.48538, clampedToFloor: false },
  { eTrunc_mult: 1, cC_invert_mult: 0.49888, clampedToFloor: false },
  { eTrunc_mult: 1.0833, cC_invert_mult: 0.51147, clampedToFloor: false },
  { eTrunc_mult: 1.1667, cC_invert_mult: 0.52331, clampedToFloor: false },
  { eTrunc_mult: 1.25, cC_invert_mult: 0.53475, clampedToFloor: false },
  { eTrunc_mult: 1.3333, cC_invert_mult: 0.54544, clampedToFloor: false },
  { eTrunc_mult: 1.4167, cC_invert_mult: 0.55573, clampedToFloor: false },
  { eTrunc_mult: 1.5, cC_invert_mult: 0.56543, clampedToFloor: false },
].map((r) => Object.freeze(r)));

// gap = 0 contour with E_flow = 0: clamped to the 0.1x floor for every E_trunc mult (contour pushed out
// of the [0.1x, 1.5x] search window -- not a real crossing).
export const IMP95658_CONTOUR_EFLOW_ZERO = Object.freeze([
  { eTrunc_mult: 0.5, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 0.5833, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 0.6667, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 0.75, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 0.8333, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 0.9167, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 1, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 1.0833, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 1.1667, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 1.25, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 1.3333, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 1.4167, cC_invert_mult: 0.1, clampedToFloor: true },
  { eTrunc_mult: 1.5, cC_invert_mult: 0.1, clampedToFloor: true },
].map((r) => Object.freeze(r)));

// Headline scalars (baked; each matches the imp-95639 documented value).
export const IMP95658_HEADLINE = Object.freeze({
  withFlow: {
    baseGap: 0.01315,
    minGap: -0.004682,
    minAt: Object.freeze({ cC_mult: 0.5, eTrunc_mult: 1.5 }),
    anyInvertInBox: true,
  },
  eFlowZero: {
    baseGap: 0.020465,
    minGap: 0.017076,
    minAt: Object.freeze({ cC_mult: 1.5, eTrunc_mult: 0.5 }),
    anyInvertInBox: false,
  },
  wedgeRemovedByZeroingFlow: true,
  isRigorous: false,
  note: 'Presentation/measurement only; NOT an RH bound; no QED; no refereed bound is changed.',
});

// Cheap import-light self-check: baked literals stay internally consistent with the imp-95639 headline
// (no quadrature is re-run; this only validates the baked grids against the documented min/corner facts).
export const IMP95658_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95658-grid-shapes-square',
    description: 'both 21x21 surfaces and both contours are the expected shapes',
    holds: () =>
      IMP95658_AXIS_MULTS.length === 21 &&
      IMP95658_GAP_SURFACE_WITH_FLOW.length === 21 &&
      IMP95658_GAP_SURFACE_WITH_FLOW.every((r) => r.length === 21) &&
      IMP95658_GAP_SURFACE_EFLOW_ZERO.length === 21 &&
      IMP95658_GAP_SURFACE_EFLOW_ZERO.every((r) => r.length === 21) &&
      IMP95658_CONTOUR_WITH_FLOW.length === IMP95658_CONTOUR_E_MULTS.length &&
      IMP95658_CONTOUR_EFLOW_ZERO.length === IMP95658_CONTOUR_E_MULTS.length,
  },
  {
    id: 'imp95658-baked-min-matches-imp95639-withflow',
    description: 'WITH-E_flow baked grid min ~ -0.00468 at (C_C 0.5x, E_trunc 1.5x), inverts',
    holds: () => {
      let mn = Infinity;
      let at = null;
      IMP95658_AXIS_MULTS.forEach((mc, i) =>
        IMP95658_AXIS_MULTS.forEach((me, j) => {
          const g = IMP95658_GAP_SURFACE_WITH_FLOW[i][j];
          if (g < mn) { mn = g; at = { i, j }; }
        }),
      );
      return (
        Math.abs(mn - IMP95658_HEADLINE.withFlow.minGap) < 1e-9 &&
        Math.abs(mn - -0.004682) < 5e-4 &&
        IMP95658_AXIS_MULTS[at.i] === 0.5 &&
        IMP95658_AXIS_MULTS[at.j] === 1.5 &&
        IMP95658_HEADLINE.withFlow.anyInvertInBox === true
      );
    },
  },
  {
    id: 'imp95658-baked-min-matches-imp95639-eflowzero',
    description: 'E_flow = 0 baked grid min ~ +0.01708 at opposite corner (C_C 1.5x, E_trunc 0.5x), no inversion',
    holds: () => {
      let mn = Infinity;
      let at = null;
      IMP95658_AXIS_MULTS.forEach((mc, i) =>
        IMP95658_AXIS_MULTS.forEach((me, j) => {
          const g = IMP95658_GAP_SURFACE_EFLOW_ZERO[i][j];
          if (g < mn) { mn = g; at = { i, j }; }
        }),
      );
      return (
        Math.abs(mn - IMP95658_HEADLINE.eFlowZero.minGap) < 1e-9 &&
        Math.abs(mn - 0.017076) < 5e-4 &&
        IMP95658_AXIS_MULTS[at.i] === 1.5 &&
        IMP95658_AXIS_MULTS[at.j] === 0.5 &&
        IMP95658_HEADLINE.eFlowZero.anyInvertInBox === false
      );
    },
  },
  {
    id: 'imp95658-contour-window-verdict',
    description: 'WITH-E_flow contour sits inside the box (not floor-clamped); E_flow = 0 contour clamped out to the 0.1x floor',
    holds: () =>
      IMP95658_CONTOUR_WITH_FLOW.some((r) => !r.clampedToFloor) &&
      IMP95658_CONTOUR_WITH_FLOW.every((r) => r.cC_invert_mult > 0.1 && r.cC_invert_mult < 1.5) &&
      IMP95658_CONTOUR_EFLOW_ZERO.every((r) => r.clampedToFloor === true) &&
      IMP95658_HEADLINE.wedgeRemovedByZeroingFlow === true,
  },
  {
    id: 'imp95658-honesty-gate-no-qed',
    description: 'presentation/measurement only: isRigorous false, no refereed bound is changed, no QED',
    holds: () =>
      IMP95658_HEADLINE.isRigorous === false &&
      /NOT an RH bound/.test(IMP95658_HEADLINE.note) &&
      /refereed bound is changed/i.test(IMP95658_HEADLINE.note),
  },
];

for (const a of IMP95658_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error('imp-95658-eflow-inversion-contour-surface-viz-data assertion failed: ' + a.id);
  }
}
