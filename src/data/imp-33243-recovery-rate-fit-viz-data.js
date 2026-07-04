/**
 * @module imp-33243-recovery-rate-fit-viz-data
 * @fileoverview imp-33243 -- lightweight, import-light literal data for a visualization of
 *   the imp-33211 fit of the imp-3869 deep-tail exact-saddle ratio recovery RATE against the
 *   imp-3735 closed-form Laplace-variance law 4/(n ln n), n in [624,1424]: the closed-form-law
 *   ratio P_r(n) = |r_n| (n ln n)/4 (flat iff |r_n| ~ 4/(n ln n)) and the windowed local decay
 *   exponent p_r(n) = -d ln|r_n| / d ln n (W=60), both monotone increasing across the tail and
 *   climbing toward, but never reaching, 1.
 *
 *   Values are a one-off bake of the IDENTICAL imp-33211 buildLadder(T_A=2, NM=3200, MMAX=1428,
 *   innerHi=2, innerN=4800) ladder via scripts/imp-33243-recovery-rate-fit-viz-data-gen.mjs
 *   (duplicates the imp-3869/imp-33211 kernel/quadrature exactly; does not import the
 *   self-computing module, so this file costs nothing to import at page load).
 *
 *   @see imp-33211-saddle-ratio-recovery-rate-fit.js (the source measurement fitted here)
 *   @see imp-33214-saddle-ratio-deep-tail-recovery-viz-data.js (the r_n value this fits the rate of)
 *   @see imp-3735-moment-ratio-correction-tail.js (the 4/(n ln n) Laplace-variance law)
 *
 *   HONEST CAVEAT: the imp-33211 P_r < 1 reading on this window was later found by imp-33230
 *   (extending the identical ladder past n=1424) to be a finite-window artifact -- P_r crosses 1
 *   at n ~ 1457, immediately above where this window stops. This chart presents the imp-33211
 *   n in [624,1424] measurement honestly, with that supersession noted, not as a settled asymptote.
 *
 *   Ticket: imp-33243 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched; NO QED.
 */

// P_r(n) = |r_n| (n ln n)/4 -- flat iff |r_n| ~ 4/(n ln n); the closed-form-law ratio.
export const IMP33243_PR_SAMPLES = Object.freeze([
  { n: 624, pr: 0.5700387580047285 },
  { n: 664, pr: 0.6022942953508058 },
  { n: 700, pr: 0.6296114775173384 },
  { n: 704, pr: 0.6325544983462202 },
  { n: 720, pr: 0.644152115832008 },
  { n: 744, pr: 0.6610467168386023 },
  { n: 784, pr: 0.6879621070407543 },
  { n: 790, pr: 0.6918737724566433 },
  { n: 824, pr: 0.7134628929157154 },
  { n: 864, pr: 0.737687894599884 },
  { n: 900, pr: 0.758498866728002 },
  { n: 904, pr: 0.7607568055536464 },
  { n: 944, pr: 0.7827735367120131 },
  { n: 984, pr: 0.8038288607659531 },
  { n: 1000, pr: 0.8119999901097322 },
  { n: 1024, pr: 0.824002529681409 },
  { n: 1064, pr: 0.8433649813314733 },
  { n: 1104, pr: 0.8619787297240864 },
  { n: 1144, pr: 0.8798995039253042 },
  { n: 1184, pr: 0.8971771923248599 },
  { n: 1200, pr: 0.9039184011668371 },
  { n: 1224, pr: 0.9138566289512177 },
  { n: 1264, pr: 0.9299782444650124 },
  { n: 1300, pr: 0.9440410750401809 },
  { n: 1304, pr: 0.9455786295399992 },
  { n: 1344, pr: 0.9606909936158081 },
  { n: 1384, pr: 0.975345574302398 },
  { n: 1424, pr: 0.9895699717250357 },
]);

// p_r(n) = -d ln|r_n| / d ln n, windowed half-width 60 -- the local decay exponent, climbing toward ~1.
export const IMP33243_PEXP_SAMPLES = Object.freeze([
  { n: 624, exp: 0.23632602365992178 },
  { n: 664, exp: 0.28841196142502246 },
  { n: 700, exp: 0.3280554145148399 },
  { n: 704, exp: 0.3321073741579419 },
  { n: 720, exp: 0.3476885053276767 },
  { n: 744, exp: 0.3693374892668202 },
  { n: 784, exp: 0.4014733620888811 },
  { n: 790, exp: 0.405920159471131 },
  { n: 824, exp: 0.42951900144605465 },
  { n: 864, exp: 0.454227181321405 },
  { n: 900, exp: 0.4740898634265416 },
  { n: 904, exp: 0.47617386519495297 },
  { n: 944, exp: 0.49580752671954603 },
  { n: 984, exp: 0.5134827947033057 },
  { n: 1000, exp: 0.5200701738136664 },
  { n: 1024, exp: 0.5294839426836347 },
  { n: 1064, exp: 0.5440416502947738 },
  { n: 1104, exp: 0.557345109042868 },
  { n: 1144, exp: 0.5695510793368866 },
  { n: 1184, exp: 0.5807905535137197 },
  { n: 1200, exp: 0.5850410777716232 },
  { n: 1224, exp: 0.5911739841320182 },
  { n: 1264, exp: 0.600795095570189 },
  { n: 1300, exp: 0.608868790541032 },
  { n: 1304, exp: 0.6097340355928355 },
  { n: 1344, exp: 0.6180597728265915 },
]);

export const IMP33243_TAIL_LO_N = 624;
export const IMP33243_TAIL_HI_N = 1424;
export const IMP33243_PR_AT_TAIL_LO = 0.5700387580047285;
export const IMP33243_PR_AT_TAIL_HI = 0.9895699717250357;
export const IMP33243_EXP_AT_720 = 0.3476885053276767; // imp-33211's reported ~0.348
export const IMP33243_EXP_AT_1300 = 0.608868790541032; // imp-33211's reported ~0.609
// imp-33230 later found P_r CROSSES 1 just past this window's right edge (finite-window artifact).
export const IMP33243_PR_CROSSING_N = 1457;
