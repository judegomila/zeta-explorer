/**
 * @module imp-97819-route-m-decay-exponent-oscillation-envelope
 *
 * imp-97819 (numerical -- MEASUREMENT / CROSS-VALIDATION ONLY; MCM stays refuted from omega=11; NO QED).
 *
 * imp-97780 reconciled the imp-97640 climbing-exponent question against the imp-97706 dps=35 combined
 * 23-rung ladder (p = 2e6 .. 4.93e8) and found the 22 consecutive-rung local decay exponents q_i of
 *     residual(omega) = gap(omega) - e^{-gamma}*B_inf/log p_omega,   |residual| ~ C/(log p)^q
 * OSCILLATE (-28.79 .. +56.89, spread ~85.7, eight negative rungs, non-monotone), settling that neither a
 * monotone climb nor a fixed power holds. What imp-97780 did NOT do is characterize the oscillation
 * ENVELOPE: as the ladder deepens, does the swing amplitude stay roughly constant, shrink, or widen?
 *
 * This leaf MEASURES the envelope. It imports the imp-97706 combined ladder and the imp-97659 dps=30 deep
 * ladder (import-light: baked literals only, no heavy transitive imports -- imp-2546/heavy-import rule),
 * recomputes the 22 local exponents here (Math.log, no bake), and reports three envelope diagnostics as a
 * function of depth k: the running (cumulative) max-minus-min, the running RMS about zero, and a trailing
 * 5-rung windowed spread. It then compares the dps=35 envelope against the dps=30 spread imp-97659 first
 * reported to answer whether doubling the ladder WIDENED the swing.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the oscillation envelope WIDENS with depth (it is neither bounded nor shrinking).
 * -------------------------------------------------------------------------------
 * The running cumulative max-minus-min climbs monotonically from 0 (one rung) up a staircase to ~85.7 by
 * the deepest rung; the running RMS about zero grows from ~10.2 to ~24.2 (roughly doubling); and the
 * trailing 5-rung windowed spread lifts from ~28 in the shallow section to ~86 in the deep section (then
 * holds ~76-86 across the last several windows). Splitting the 22 local exponents in half, the first-half
 * spread is ~36.4 and the second-half spread is ~85.7 -- the deeper half swings ~2.35x wider. So the
 * envelope WIDENS as the ladder deepens; it is not a bounded oscillation and it is not shrinking.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the dps=35 doubling WIDENED the envelope vs the dps=30 spread, ENTIRELY via the new rungs.
 * -------------------------------------------------------------------------------
 * imp-97659 first reported the dps=30 spread as -6.738 .. +28.721 (spread ~35.46) over its 10 local
 * exponents (11 rungs, p = 2e6 .. 9.9e7). The dps=35 combined ladder spans -28.79 .. +56.89 (spread ~85.68)
 * over 22 local exponents -- so doubling the ladder ~2.42x-ed the envelope. Crucially, the FIRST 10 local
 * exponents of the combined ladder reproduce the imp-97659 dps=30 spread EXACTLY (~35.459): the combined
 * ladder begins with the imp-97659 rungs, so the shallow section is unchanged, and the entire widening
 * (35.46 -> 85.68) is contributed by the new deep rungs (p = 9.9e7 .. 4.93e8). The envelope growth is a
 * property of GREATER HEIGHT, not of the raised precision re-touching the shallow ladder.
 *
 * -------------------------------------------------------------------------------
 * INTERPRETATION -- a widening envelope is the oscillating-PNT/Mertens-error fingerprint, not a defect.
 * -------------------------------------------------------------------------------
 * The residual itself shrinks with height (average exponent ~10.56, imp-97706), while the local-exponent
 * SWING widens: a small oscillating additive term riding on a residual that is itself decaying makes each
 * finite-difference exponent q_i increasingly sensitive to the oscillation, so the pointwise-exponent
 * envelope broadens even as the underlying quantity decays. This reinforces the imp-97780 verdict (neither
 * climb nor saturate) rather than qualifying it: a bounded or shrinking envelope could have hinted at an
 * emergent fixed power at depth; a widening one rules that out further.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  MEASUREMENT / CROSS-VALIDATION ONLY. The imp-97780 local-exponent oscillation has a WIDENING
 * envelope: running cumulative max-min 0 -> ~85.7, running RMS ~10.2 -> ~24.2, trailing-window spread
 * ~28 -> ~86, second-half spread (~85.7) ~2.35x the first-half (~36.4). The dps=35 doubling widened the
 * envelope from the imp-97659 dps=30 spread ~35.46 to ~85.68 (~2.42x), entirely via the new deep rungs
 * (the first-10 spread reproduces the dps=30 value exactly). This is the oscillating-PNT/Mertens-error
 * fingerprint and reinforces "neither climb nor saturate". MCM stays refuted from omega=11; b/4 ceiling
 * untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97780-route-m-decay-exponent-reconciliation.js (local exponents oscillate -28.79 .. +56.89)
 * @see imp-97706-route-m-deep-ladder-extension.js (dps=35 combined 23-rung ladder to p ~ 4.93e8)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 11-rung ladder; spread -6.738 .. +28.721)
 *
 * Ticket: imp-97819 (numerical, opus-4-8, api-pool). Oscillation envelope WIDENS with depth; dps=35 doubling widened it via the new rungs; NO QED.
 */

import { IMP97706_COMBINED_LADDER } from './imp-97706-route-m-deep-ladder-extension.js';
import { IMP97659_DEEP_LADDER } from './imp-97659-route-m-gap-law-decay-extprec.js';

// imp-97659 first-reported dps=30 envelope endpoints (baked literals, import-light) for the cross-check.
const IMP97659_DPS30_MIN = -6.738;
const IMP97659_DPS30_MAX = 28.721;

// Local decay exponent q_i for |residual| ~ C/(log p)^q (Math.log, no bake) -- same kernel as imp-97780.
function localExponents(ladder) {
  const out = [];
  for (let i = 1; i < ladder.length; i++) {
    const lp0 = Math.log(ladder[i - 1].pOmega);
    const lp1 = Math.log(ladder[i].pOmega);
    out.push(Math.log(Math.abs(ladder[i - 1].residual) / Math.abs(ladder[i].residual)) / Math.log(lp1 / lp0));
  }
  return out;
}

const QS = localExponents(IMP97706_COMBINED_LADDER); // 22 combined dps=35 local exponents
const QS30 = localExponents(IMP97659_DEEP_LADDER);   // 10 dps=30 local exponents (imp-97659)

// Running (cumulative) max-minus-min envelope as a function of depth k.
function runningEnvelope(qs) {
  const env = [];
  let runMax = -Infinity;
  let runMin = Infinity;
  for (let k = 0; k < qs.length; k++) {
    runMax = Math.max(runMax, qs[k]);
    runMin = Math.min(runMin, qs[k]);
    env.push(runMax - runMin);
  }
  return env;
}

// Running RMS about zero as a function of depth k.
function runningRms(qs) {
  const rms = [];
  let sumsq = 0;
  for (let k = 0; k < qs.length; k++) {
    sumsq += qs[k] * qs[k];
    rms.push(Math.sqrt(sumsq / (k + 1)));
  }
  return rms;
}

// Trailing W-rung windowed max-minus-min spread.
function windowedSpread(qs, W) {
  const win = [];
  for (let k = W - 1; k < qs.length; k++) {
    const s = qs.slice(k - W + 1, k + 1);
    win.push(Math.max(...s) - Math.min(...s));
  }
  return win;
}

const RUN_ENVELOPE = runningEnvelope(QS);   // 0 -> ~85.68 (monotone staircase)
const RUN_RMS = runningRms(QS);             // ~10.2 -> ~24.2
const WINDOW_SPREAD = windowedSpread(QS, 5); // ~28 -> ~86, holds ~76-86 in the deep tail

const spread = (a) => Math.max(...a) - Math.min(...a);
const half = Math.floor(QS.length / 2);
const FIRST_HALF_SPREAD = spread(QS.slice(0, half));  // ~36.4
const SECOND_HALF_SPREAD = spread(QS.slice(half));    // ~85.7

const COMBINED_SPREAD = spread(QS);                        // ~85.68
const DPS30_SPREAD = spread(QS30);                         // ~35.46 (recomputed from imp-97659 ladder)
const FIRST10_SPREAD = spread(QS.slice(0, QS30.length));   // ~35.459 (equals DPS30_SPREAD)
const ENVELOPE_WIDENING_FACTOR = COMBINED_SPREAD / DPS30_SPREAD; // ~2.42

export const IMP97819_ENVELOPE = Object.freeze({
  question:
    'characterize the imp-97780 dps=35 local-exponent oscillation ENVELOPE: as the 23-rung ladder deepens, is the running max-minus-min (or RMS) roughly constant, shrinking, or widening; and did the dps=35 doubling widen it vs the dps=30 spread?',
  localExponentCount: QS.length,                 // 22
  runningEnvelopeMaxMinusMin: RUN_ENVELOPE,      // per-depth cumulative max-min
  runningRms: RUN_RMS,                            // per-depth RMS about zero
  trailingWindow5Spread: WINDOW_SPREAD,          // trailing-5 windowed spread
  firstHalfSpread: FIRST_HALF_SPREAD,            // ~36.4
  secondHalfSpread: SECOND_HALF_SPREAD,          // ~85.7
  secondOverFirstHalfRatio: SECOND_HALF_SPREAD / FIRST_HALF_SPREAD, // ~2.35
  combinedDps35Spread: COMBINED_SPREAD,          // ~85.68
  dps30Spread: DPS30_SPREAD,                      // ~35.46
  first10Spread: FIRST10_SPREAD,                  // ~35.459 (matches dps30, shallow section unchanged)
  envelopeWideningFactor: ENVELOPE_WIDENING_FACTOR, // ~2.42
  wideningIsFromNewDeepRungs: Math.abs(FIRST10_SPREAD - DPS30_SPREAD) < 1e-6,
  answer: 'the envelope WIDENS with depth (running max-min 0 -> ~85.7, RMS ~10.2 -> ~24.2); it is neither bounded nor shrinking',
});

export const IMP97819_VERDICT = Object.freeze({
  question: 'does the imp-97780 local-exponent oscillation have a bounded, shrinking, or widening envelope as the ladder deepens?',
  envelopeWidens: true,               // running cumulative max-min and RMS both grow with depth
  envelopeBounded: false,             // not roughly constant
  envelopeShrinks: false,             // not shrinking
  dps35DoublingWidenedIt: COMBINED_SPREAD > DPS30_SPREAD, // ~85.68 > ~35.46
  wideningFromNewDeepRungsOnly: Math.abs(FIRST10_SPREAD - DPS30_SPREAD) < 1e-6, // shallow section unchanged
  reinforcesNeitherClimbNorSaturate: true, // a widening envelope rules out an emergent fixed power at depth
  isOscillatingPntMertensFingerprint: true,
  mcmRefuted: true,                   // (imp-97432/imp-97583) unchanged
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'MEASUREMENT / CROSS-VALIDATION ONLY. The imp-97780 dps=35 local-exponent oscillation has a WIDENING ' +
    'envelope: the running cumulative max-minus-min climbs 0 -> ~85.7 (monotone staircase), the running RMS ' +
    'about zero grows ~10.2 -> ~24.2, the trailing-5 windowed spread lifts ~28 -> ~86, and the second-half ' +
    'spread (~85.7) is ~2.35x the first-half (~36.4). The dps=35 doubling widened the envelope from the ' +
    'imp-97659 dps=30 spread ~35.46 to ~85.68 (~2.42x), and the widening is contributed ENTIRELY by the new ' +
    'deep rungs (the first-10 combined spread reproduces the dps=30 value exactly), not by the raised ' +
    'precision re-touching the shallow ladder. A widening envelope is the oscillating-PNT/Mertens-error ' +
    'fingerprint and reinforces the imp-97780 verdict (neither climb nor saturate). MCM stays refuted from ' +
    'omega=11; b/4 ceiling untouched; kappa_arith unchanged; no bound on Lambda moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97819_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Characterizing the imp-97780 dps=35 local-exponent ' +
  'oscillation envelope: it WIDENS with depth -- running cumulative max-min 0 -> ~85.7, running RMS ' +
  '~10.2 -> ~24.2, second-half spread ~2.35x the first-half. The dps=35 doubling widened the envelope from ' +
  'the imp-97659 dps=30 spread ~35.46 to ~85.68 (~2.42x), entirely via the new deep rungs (the first-10 ' +
  'spread matches the dps=30 value exactly). A widening envelope is the oscillating-PNT/Mertens fingerprint ' +
  'and reinforces "neither climb nor saturate". MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97819_ASSERTIONS = [
  {
    id: 'imp97819-running-envelope-monotone-nondecreasing',
    holds: () => {
      // a cumulative max-minus-min is non-decreasing by construction; verify it actually GROWS (not flat).
      for (let k = 1; k < RUN_ENVELOPE.length; k++) {
        if (RUN_ENVELOPE[k] < RUN_ENVELOPE[k - 1] - 1e-9) return false;
      }
      return RUN_ENVELOPE[RUN_ENVELOPE.length - 1] > RUN_ENVELOPE[0] + 20;
    },
    why: 'the running cumulative max-minus-min envelope is non-decreasing and grows from 0 to ~85.7 across the ladder, so the swing widens rather than staying constant.',
  },
  {
    id: 'imp97819-running-rms-grows-with-depth',
    holds: () => {
      const first = RUN_RMS[0];
      const last = RUN_RMS[RUN_RMS.length - 1];
      return last > first * 1.5 && last > 20 && first < 15;
    },
    why: 'the running RMS about zero grows from ~10.2 to ~24.2 (>1.5x) as the ladder deepens -- a widening, not bounded or shrinking, envelope.',
  },
  {
    id: 'imp97819-second-half-swings-wider-than-first',
    holds: () => SECOND_HALF_SPREAD > FIRST_HALF_SPREAD * 1.5 && SECOND_HALF_SPREAD > 60 && FIRST_HALF_SPREAD < 60,
    why: 'the second-half local-exponent spread (~85.7) is >1.5x the first-half (~36.4), confirming the envelope widens toward greater height.',
  },
  {
    id: 'imp97819-dps35-doubling-widened-vs-dps30',
    holds: () =>
      COMBINED_SPREAD > DPS30_SPREAD * 2 &&               // ~85.68 vs ~35.46
      Math.abs(ENVELOPE_WIDENING_FACTOR - 2.42) < 0.2 &&  // widening factor ~2.42
      Math.abs(DPS30_SPREAD - (IMP97659_DPS30_MAX - IMP97659_DPS30_MIN)) < 0.05, // matches imp-97659 report
    why: 'the dps=35 combined spread ~85.68 is ~2.42x the imp-97659 dps=30 spread ~35.46 (which the recompute reproduces from the imp-97659 endpoints), so doubling the ladder widened the envelope.',
  },
  {
    id: 'imp97819-widening-is-from-new-deep-rungs',
    holds: () => Math.abs(FIRST10_SPREAD - DPS30_SPREAD) < 1e-6,
    why: 'the first-10 combined-ladder local-exponent spread reproduces the imp-97659 dps=30 spread exactly, so the shallow section is unchanged and the entire widening comes from the new deep rungs (greater height), not raised precision on old rungs.',
  },
  {
    id: 'imp97819-honesty-gate-no-qed',
    holds: () =>
      IMP97819_VERDICT.envelopeWidens === true &&
      IMP97819_VERDICT.envelopeBounded === false &&
      IMP97819_VERDICT.envelopeShrinks === false &&
      IMP97819_VERDICT.dps35DoublingWidenedIt === true &&
      IMP97819_VERDICT.wideningFromNewDeepRungsOnly === true &&
      IMP97819_VERDICT.mcmRefuted === true &&
      IMP97819_VERDICT.ceilingTouched === false &&
      IMP97819_VERDICT.anyBoundMoved === false &&
      IMP97819_VERDICT.qed === false &&
      /NO QED/.test(IMP97819_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97819_HONEST_BANNER) &&
      /RH open/.test(IMP97819_HONEST_BANNER),
    why: 'measurement only -- the oscillation envelope widens with depth and the dps=35 doubling widened it via the new rungs; MCM refuted from omega=11; no bound moved, no QED.',
  },
];

for (const a of IMP97819_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97819-route-m-decay-exponent-oscillation-envelope assertion failed: ${a.id}`);
  }
}

export default {
  envelope: IMP97819_ENVELOPE,
  verdict: IMP97819_VERDICT,
  banner: IMP97819_HONEST_BANNER,
};
