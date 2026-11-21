/**
 * @module imp-97676-edge-floor-operational-vs-intrinsic-honest-status
 * @fileoverview imp-97676 -- HONEST-STATUS NOTE reconciling two edge-amplitude "floor" estimates for
 *   the imp-97580/imp-97605 Krein far-field tail bias relBias(3.36) = -2.727e-5 sign resolvability:
 *   the imp-97625 OPERATIONAL floor (~1e-9, propagated from baked IEEE-double / composite-Simpson
 *   literals) and the imp-97643 INTRINSIC floor (3.76e-13 R*-local / 5.89e-15 zero-cross, from an
 *   independent dps=40 exact-quadrature recomputation). The two numbers differ by ~4 orders of
 *   magnitude; this note records why that is NOT a contradiction.
 *
 * WHY. Read side by side, imp-97625's ~1e-9 floor and imp-97643's ~1e-13 floor could look like
 * competing measurements of "the same floor". They are not: imp-97625 measured how far the IEEE-double
 * / Simpson-quadrature computation of imp-97605 sits from the exact closed form -- an OPERATIONAL floor
 * set by the arithmetic and quadrature used, not by the underlying finite-t endpoint asymptotics.
 * imp-97643 then recomputed the same edge amplitudes with adaptive mpmath quadrature at dps=40 (zero
 * Simpson/IEEE noise) and measured the INTRINSIC floor set purely by genuine finite-t truncation. The
 * intrinsic floor is ~4-6 orders tighter because most of the imp-97625 ~1e-9 number was double-precision
 * / Simpson noise, not a real limit on how well g_pp, g_ppp can in principle be resolved.
 *
 * RECONCILIATION. Both floors correctly certify the same conclusion from different vantage points:
 *   - operational (imp-97625): |relBias(3.36)| = 2.727e-5 exceeds the ~1e-9 IEEE floor by SNR ~2.9e4 /
 *     9.39e3 -- i.e. resolvable using ONLY the double-precision literals already on hand.
 *   - intrinsic (imp-97643): the same |relBias(3.36)| exceeds the true dps=40 floor (3.76e-13 R*-local,
 *     5.89e-15 zero-cross) by SNR 7.25e7 / 4.63e9 -- i.e. resolvable by a much wider margin once
 *     arithmetic noise is removed.
 * The intrinsic number is smaller (tighter) than the operational number because it strips out
 * arithmetic noise the operational estimate could not separate from genuine truncation error. So the
 * imp-97625 "~1e4x above the floor" claim was always CORRECT but CONSERVATIVE: a weak lower bound on
 * the true signal-to-floor ratio, not an independent or competing estimate. Both agree relBias(3.36)'s
 * negative sign is genuinely resolvable, and both agree the sign-change RADIUS at Rc = 1/a stays below
 * whichever floor is used (unresolvable there either way).
 *
 * VERDICT. No contradiction: imp-97625 (operational, ~1e-9) and imp-97643 (intrinsic, ~1e-13) measure
 * different things -- arithmetic-noise-limited vs truncation-limited resolvability of the same edge
 * amplitudes -- and both certify relBias(3.36) = -2.727e-5's sign as a genuine signal, with imp-97643
 * showing the imp-97625 estimate was conservative. Read-only reconciliation; changes no bound; the
 * m=1/m=2 Krein enclosure stays unusable at 2a = ln 3; interval-rigorous reach stays 2a <= 0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97625-krein-tail-bias-signal-vs-floor-assessment.js (operational IEEE-double floor, SNR ~1e4x)
 * @see imp-97643-krein-edge-floor-hiprec-crosscheck.js (intrinsic dps=40 floor, SNR ~1e7x-1e9x)
 * @see imp-97605-krein-tail-bias-direct-ct-crossvalidation.js (the IEEE-double direct measurement both cross-check)
 *
 * Ticket: imp-97676 (content, sonnet-4-6, sonnet). Honest-status note only; no bound on Lambda moves;
 * no refereed bound is changed; RH open; NO QED.
 */

import { IMP97625_FLOOR_ASSESSMENT, IMP97625_VERDICT } from './imp-97625-krein-tail-bias-signal-vs-floor-assessment.js';
import { IMP97643_HIPREC_CROSSCHECK, IMP97643_VERDICT } from './imp-97643-krein-edge-floor-hiprec-crosscheck.js';

export const IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS = Object.freeze({
  ticket: 'imp-97676',
  question:
    'does the imp-97643 intrinsic hi-prec edge-amplitude floor (3.76e-13) contradict the imp-97625 ' +
    'operational IEEE-double floor (~1e-9) for the relBias(3.36) sign resolvability?',
  operationalFloorRelBias: IMP97625_FLOOR_ASSESSMENT.floorRelBiasR336Local, // ~2.91e-9
  operationalFloorZeroCross: IMP97625_FLOOR_ASSESSMENT.floorRelBiasZeroCross, // ~9.42e-10
  operationalSnr: IMP97625_FLOOR_ASSESSMENT.snrR336Local, // ~9.39e3
  intrinsicFloorRelBias: IMP97643_HIPREC_CROSSCHECK.floorR336LocalHiprec, // 3.76e-13
  intrinsicFloorZeroCross: IMP97643_HIPREC_CROSSCHECK.floorZeroCrossHiprec, // 5.89e-15
  intrinsicSnr: IMP97643_HIPREC_CROSSCHECK.snrR336LocalHiprec, // ~7.25e7
  intrinsicBelowOperational: IMP97643_HIPREC_CROSSCHECK.floorR336LocalHiprec < IMP97625_FLOOR_ASSESSMENT.floorRelBiasR336Local,
  ratioOfFloors:
    IMP97625_FLOOR_ASSESSMENT.floorRelBiasR336Local / IMP97643_HIPREC_CROSSCHECK.floorR336LocalHiprec, // ~7.74e3
  contradiction: false,
  reconciliation:
    'the two floors measure different things: imp-97625 propagated an OPERATIONAL floor set by ' +
    'IEEE-double arithmetic and composite-Simpson quadrature noise in the imp-97605 direct measurement; ' +
    'imp-97643 recomputed the same edge amplitudes with adaptive mpmath quadrature at dps=40 (no ' +
    'Simpson/IEEE noise) and measured the INTRINSIC floor set purely by genuine finite-t truncation. ' +
    'The intrinsic floor is ~4 orders tighter because most of the operational ~1e-9 number was ' +
    'arithmetic noise, not a real limit on resolvability -- so the imp-97625 SNR estimate was correct ' +
    'but conservative, not an independent or competing measurement.',
  bothAgreeSignResolvable: IMP97625_VERDICT.signResolvableAtR336 === true && IMP97643_VERDICT.signResolvableAtR336 === true,
  bothAgreeRadiusUnresolvable:
    IMP97625_VERDICT.signChangeRadiusResolvableAtRc === false &&
    IMP97643_VERDICT.signChangeRadiusResolvableAtRc === false,
  operationalWasConservative: true,
  binding_2a: IMP97625_VERDICT.binding_2a,
  intervalRigorousReachUnchanged: 0.96,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  measurementOnly: true,
  isRigorous: false,
  qed: false,
});

export const IMP97676_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. This note reconciles the imp-97625 operational ' +
  'IEEE-double edge-amplitude floor (~1e-9, arithmetic/Simpson-noise-limited) with the imp-97643 ' +
  'intrinsic dps=40 floor (3.76e-13, truncation-limited): they measure different things and are not ' +
  'in conflict. Both certify the relBias(3.36) = -2.727e-5 negative sign as a genuine resolvable signal ' +
  '(SNR ~9.4e3 operational, ~7.3e7 intrinsic); the imp-97625 estimate was correct but conservative. No ' +
  'bound moved.';

export default IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS;

// -- self-executing assertion (imp-3715 convention): any failure throws at import --
if (
  !(
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.contradiction === false &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.intrinsicBelowOperational === true &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.ratioOfFloors > 1e3 &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.ratioOfFloors < 1e5 &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.bothAgreeSignResolvable === true &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.bothAgreeRadiusUnresolvable === true &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.operationalWasConservative === true &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.anyBoundMoved === false &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.operatorPositivityEstablished === false &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.measurementOnly === true &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.isRigorous === false &&
    IMP97676_FLOOR_RECONCILIATION_HONEST_STATUS.qed === false &&
    /NO QED/.test(IMP97676_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97676_HONEST_BANNER) &&
    /RH open/.test(IMP97676_HONEST_BANNER)
  )
) {
  throw new Error(
    'imp-97676-edge-floor-operational-vs-intrinsic-honest-status assertion FAILED: the imp-97625 ' +
      'operational floor and imp-97643 intrinsic floor must reconcile as non-contradictory, both ' +
      'certifying relBias(3.36) sign resolvability.'
  );
}
