/**
 * @module imp-33611-band-crossing-floor-bisection-viz-data
 *
 * imp-33611 (ux): lightweight, import-light viz-data module for a chart of the
 * imp-33579 band-crossing floor bisection. Presents the dense every-integer
 * scan of floorUlp(n) -- the graded-GL grade-4 plateau smallest residual at
 * budgets &gt;= 200 nodes vs the imp-33213 A_log target -- over n in [510,596],
 * showing the jittery non-monotone spikes (the first raw rung clearing 64 ULP
 * at n=531, floor dips to ~0 ULP at n=518/552/595), overlaid with the +/-5
 * rolling-max envelope (first reaches 64 ULP at n=526) and the imp-33316
 * &lt; 64 ULP deep-tail band line.
 *
 * Reference literals are baked from a direct re-run of the imp-33579
 * self-computing scan (same phiKernel/saddleTau/graded-GL formulas, same
 * RESOLVED_PANEL_SWEEP = {20,30,50,100,200,400} panels, grade 4) -- no
 * re-derivation of the underlying A(tau) kernel or quadrature rules here.
 *
 * @see imp-33579-band-crossing-floor-bisection.js (source module: the bisection scan)
 * @see imp-33557-band-crossing-min-budget.js (the three-rung bracket this bisects)
 * @see imp-33316-graded-plateau-deep-tail-node-budget.js (the &lt; 64 ULP deep band)
 *
 * Ticket: imp-33611 (ux, medium). Presentation only, RH-equivalent; imp-3066
 * untouched; Platt-Trudgian Lambda &lt;= 0.2 stays SOTA; NO QED.
 */

export const IMP33611_BAND_ULP = 64;
export const IMP33611_BRACKET_LO = 510;
export const IMP33611_BRACKET_HI = 596;
export const IMP33611_FIRST_RAW_OVER_BAND_N = 531;
export const IMP33611_FIRST_ENV_OVER_BAND_N = 526;
export const IMP33611_DIP_NS = [518, 552, 595];

export const IMP33611_SCAN = [
  { n: 510, tauStar: 0.9410392318415262, floorUlp: 61.3628804220252, inBand: true, envelope: 61.3628804220252 },
  { n: 511, tauStar: 0.9414261728867113, floorUlp: 4.647381476681282, inBand: true, envelope: 61.3628804220252 },
  { n: 512, tauStar: 0.9418123907250526, floorUlp: 37.66587329585484, inBand: true, envelope: 61.3628804220252 },
  { n: 513, tauStar: 0.9421978880953281, floorUlp: 21.71096865968558, inBand: true, envelope: 61.3628804220252 },
  { n: 514, tauStar: 0.942582667720689, floorUlp: 10.584756583446133, inBand: true, envelope: 61.3628804220252 },
  { n: 515, tauStar: 0.94296673230878, floorUlp: 4.606543364580263, inBand: true, envelope: 61.3628804220252 },
  { n: 516, tauStar: 0.9433500845518574, floorUlp: 4.733220114120507, inBand: true, envelope: 45.231490101250124 },
  { n: 517, tauStar: 0.9437327271269047, floorUlp: 26.260494219507407, inBand: true, envelope: 45.231490101250124 },
  { n: 518, tauStar: 0.9441146626957493, floorUlp: 0, inBand: true, envelope: 45.231490101250124 },
  { n: 519, tauStar: 0.9444958939051764, floorUlp: 45.231490101250124, inBand: true, envelope: 45.231490101250124 },
  { n: 520, tauStar: 0.9448764233870435, floorUlp: 4.372980209024396, inBand: true, envelope: 45.231490101250124 },
  { n: 521, tauStar: 0.9452562537583922, floorUlp: 23.581615499508647, inBand: true, envelope: 45.231490101250124 },
  { n: 522, tauStar: 0.9456353876215589, floorUlp: 2.491242494358643, inBand: true, envelope: 45.231490101250124 },
  { n: 523, tauStar: 0.9460138275642871, floorUlp: 2.558558322702635, inBand: true, envelope: 45.231490101250124 },
  { n: 524, tauStar: 0.9463915761598347, floorUlp: 44.14233641305915, inBand: true, envelope: 45.231490101250124 },
  { n: 525, tauStar: 0.9467686359670835, floorUlp: 24.866271963219642, inBand: true, envelope: 44.14233641305915 },
  { n: 526, tauStar: 0.9471450095306457, floorUlp: 25.852314157279388, inBand: true, envelope: 76.07534592006968 },
  { n: 527, tauStar: 0.947520699380971, floorUlp: 35.3918675204401, inBand: true, envelope: 76.07534592006968 },
  { n: 528, tauStar: 0.9478957080344512, floorUlp: 0.7267256133020132, inBand: true, envelope: 76.07534592006968 },
  { n: 529, tauStar: 0.9482700379935252, floorUlp: 2.6858496760996857, inBand: true, envelope: 76.07534592006968 },
  { n: 530, tauStar: 0.9486436917467809, floorUlp: 42.46029117069101, inBand: true, envelope: 76.07534592006968 },
  { n: 531, tauStar: 0.9490166717690598, floorUlp: 76.07534592006968, inBand: false, envelope: 76.07534592006968 },
  { n: 532, tauStar: 0.9493889805215561, floorUlp: 0.8366263339789685, inBand: true, envelope: 76.07534592006968 },
  { n: 533, tauStar: 0.9497606204519193, floorUlp: 49.45957724182169, inBand: true, envelope: 76.07534592006968 },
  { n: 534, tauStar: 0.950131593994352, floorUlp: 50.75967910418232, inBand: true, envelope: 76.07534592006968 },
  { n: 535, tauStar: 0.95050190356971, floorUlp: 28.910291327256292, inBand: true, envelope: 76.07534592006968 },
  { n: 536, tauStar: 0.9508715515855983, floorUlp: 58.69142551327027, inBand: true, envelope: 76.07534592006968 },
  { n: 537, tauStar: 0.9512405404364708, floorUlp: 42.057120727905385, inBand: true, envelope: 66.87595560007436 },
  { n: 538, tauStar: 0.9516088725037226, floorUlp: 19.691720471503693, inBand: true, envelope: 66.87595560007436 },
  { n: 539, tauStar: 0.9519765501557884, floorUlp: 13.46859460483818, inBand: true, envelope: 66.87595560007436 },
  { n: 540, tauStar: 0.9523435757482346, floorUlp: 66.87595560007436, inBand: false, envelope: 66.87595560007436 },
  { n: 541, tauStar: 0.9527099516238537, floorUlp: 27.894888931011106, inBand: true, envelope: 66.87595560007436 },
  { n: 542, tauStar: 0.9530756801127567, floorUlp: 1.6749410834722533, inBand: true, envelope: 66.87595560007436 },
  { n: 543, tauStar: 0.9534407635324642, floorUlp: 36.0777146130382, inBand: true, envelope: 66.87595560007436 },
  { n: 544, tauStar: 0.9538052041879979, floorUlp: 0.6343298569144621, inBand: true, envelope: 66.87595560007436 },
  { n: 545, tauStar: 0.9541690043719704, floorUlp: 0, inBand: true, envelope: 66.87595560007436 },
  { n: 546, tauStar: 0.9545321663646744, floorUlp: 1.9213742858665157, inBand: true, envelope: 50.78994257994897 },
  { n: 547, tauStar: 0.9548946924341715, floorUlp: 3.546467720462415, inBand: true, envelope: 50.78994257994897 },
  { n: 548, tauStar: 0.955256584836379, floorUlp: 9.454833523134985, inBand: true, envelope: 50.78994257994897 },
  { n: 549, tauStar: 0.9556178458151574, floorUlp: 17.002115665809654, inBand: true, envelope: 50.78994257994897 },
  { n: 550, tauStar: 0.9559784776023965, floorUlp: 24.771016921922456, inBand: true, envelope: 50.78994257994897 },
  { n: 551, tauStar: 0.9563384824181005, floorUlp: 50.78994257994897, inBand: true, envelope: 50.78994257994897 },
  { n: 552, tauStar: 0.9566978624704723, floorUlp: 0, inBand: true, envelope: 50.78994257994897 },
  { n: 553, tauStar: 0.9570566199559976, floorUlp: 0, inBand: true, envelope: 50.78994257994897 },
  { n: 554, tauStar: 0.9574147570595282, floorUlp: 16.385320643173994, inBand: true, envelope: 50.78994257994897 },
  { n: 555, tauStar: 0.9577722759543634, floorUlp: 3.875520989224003, inBand: true, envelope: 50.78994257994897 },
  { n: 556, tauStar: 0.958129178802333, floorUlp: 1.9065230933196797, inBand: true, envelope: 50.78994257994897 },
  { n: 557, tauStar: 0.9584854677538763, floorUlp: 2.9307422341110683, inBand: true, envelope: 32.43540215862374 },
  { n: 558, tauStar: 0.9588411449481242, floorUlp: 32.43540215862374, inBand: true, envelope: 32.43540215862374 },
  { n: 559, tauStar: 0.9591962125129774, floorUlp: 0, inBand: true, envelope: 32.43540215862374 },
  { n: 560, tauStar: 0.9595506725651852, floorUlp: 0.5448741118716234, inBand: true, envelope: 39.01012301901877 },
  { n: 561, tauStar: 0.9599045272104241, floorUlp: 11.388471985700626, inBand: true, envelope: 39.01012301901877 },
  { n: 562, tauStar: 0.9602577785433748, floorUlp: 6.588715294653075, inBand: true, envelope: 53.729737521180496 },
  { n: 563, tauStar: 0.960610428647799, floorUlp: 0.5062311820736721, inBand: true, envelope: 53.729737521180496 },
  { n: 564, tauStar: 0.9609624795966152, floorUlp: 6.222873909693861, inBand: true, envelope: 53.729737521180496 },
  { n: 565, tauStar: 0.9613139334519745, floorUlp: 39.01012301901877, inBand: true, envelope: 53.729737521180496 },
  { n: 566, tauStar: 0.9616647922653352, floorUlp: 35.72571882082423, inBand: true, envelope: 53.729737521180496 },
  { n: 567, tauStar: 0.9620150580775362, floorUlp: 53.729737521180496, inBand: true, envelope: 53.729737521180496 },
  { n: 568, tauStar: 0.9623647329188716, floorUlp: 41.89115926528157, inBand: true, envelope: 53.729737521180496 },
  { n: 569, tauStar: 0.962713818809162, floorUlp: 35.77396591316694, inBand: true, envelope: 53.729737521180496 },
  { n: 570, tauStar: 0.9630623177578284, floorUlp: 20.90764100259374, inBand: true, envelope: 53.729737521180496 },
  { n: 571, tauStar: 0.9634102317639621, floorUlp: 3.2936087388086173, inBand: true, envelope: 53.729737521180496 },
  { n: 572, tauStar: 0.9637575628163968, floorUlp: 4.856118412415888, inBand: true, envelope: 53.729737521180496 },
  { n: 573, tauStar: 0.9641043128937778, floorUlp: 33.808620377115545, inBand: true, envelope: 41.89115926528157 },
  { n: 574, tauStar: 0.9644504839646331, floorUlp: 9.77290300538158, inBand: true, envelope: 38.93575512030087 },
  { n: 575, tauStar: 0.9647960779874414, floorUlp: 24.761515832516594, inBand: true, envelope: 38.93575512030087 },
  { n: 576, tauStar: 0.9651410969107008, floorUlp: 36.86868343907489, inBand: true, envelope: 38.93575512030087 },
  { n: 577, tauStar: 0.9654855426729971, floorUlp: 19.246671553767538, inBand: true, envelope: 39.53529069810402 },
  { n: 578, tauStar: 0.965829417203071, floorUlp: 38.93575512030087, inBand: true, envelope: 39.53529069810402 },
  { n: 579, tauStar: 0.9661727224198846, floorUlp: 13.66278553562194, inBand: true, envelope: 39.53529069810402 },
  { n: 580, tauStar: 0.9665154602326882, floorUlp: 18.352317068406286, inBand: true, envelope: 51.95704800951267 },
  { n: 581, tauStar: 0.9668576325410854, floorUlp: 36.0594768023168, inBand: true, envelope: 51.95704800951267 },
  { n: 582, tauStar: 0.967199241235098, floorUlp: 39.53529069810402, inBand: true, envelope: 51.95704800951267 },
  { n: 583, tauStar: 0.967540288195232, floorUlp: 2.9126934770010315, inBand: true, envelope: 51.95704800951267 },
  { n: 584, tauStar: 0.9678807752925394, floorUlp: 13.112935443673573, inBand: true, envelope: 51.95704800951267 },
  { n: 585, tauStar: 0.9682207043886837, floorUlp: 51.95704800951267, inBand: true, envelope: 51.95704800951267 },
  { n: 586, tauStar: 0.9685600773360015, floorUlp: 3.5936039347353783, inBand: true, envelope: 51.95704800951267 },
  { n: 587, tauStar: 0.9688988959775655, floorUlp: 28.123526325713318, inBand: true, envelope: 51.95704800951267 },
  { n: 588, tauStar: 0.9692371621472466, floorUlp: 14.89213570078024, inBand: true, envelope: 51.95704800951267 },
  { n: 589, tauStar: 0.9695748776697743, floorUlp: 39.88279910662916, inBand: true, envelope: 52.6270304071321 },
  { n: 590, tauStar: 0.9699120443607987, floorUlp: 3.0595050546569955, inBand: true, envelope: 52.6270304071321 },
  { n: 591, tauStar: 0.9702486640269501, floorUlp: 18.149260740668236, inBand: true, envelope: 65.30275557543644 },
  { n: 592, tauStar: 0.970584738465899, floorUlp: 11.520962479829809, inBand: true, envelope: 65.30275557543644 },
  { n: 593, tauStar: 0.9709202694664161, floorUlp: 3.7702456913656284, inBand: true, envelope: 65.30275557543644 },
  { n: 594, tauStar: 0.9712552588084296, floorUlp: 52.6270304071321, inBand: true, envelope: 65.30275557543644 },
  { n: 595, tauStar: 0.9715897082630858, floorUlp: 0, inBand: true, envelope: 65.30275557543644 },
  { n: 596, tauStar: 0.9719236195928045, floorUlp: 65.30275557543644, inBand: false, envelope: 65.30275557543644 },
];
