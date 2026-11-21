/**
 * imp-95800 -- LEAVE-ONE-OUT (jackknife) sensitivity of the imp-95722 max-based
 * windowing offset C0 = 0.3337 to a drop of the anomalous T = 1.5e5 argmax height.
 *
 * imp-95787 F1/F2 found the max-based offset C0 = max over the six imp-95710 heights of
 * (measuredVar - Selberg term) is PINNED by the SINGLE anomalous T = 1.5e5 height -- the
 * same non-monotone upward bump imp-95710 flagged -- and over-states the mean-based central
 * offset 0.2618 by +27.5%. Since a max-envelope anchor is by construction hostage to its
 * single argmax point, the natural robustness question is: how much does the derived cap
 * r_cap(3.0e12) at the imp-95519 window bottom move if that argmax height is dropped, and
 * does the r_cap < 1 conservatism survive EVERY leave-one-out re-anchoring?
 *
 * METHOD (import-light, no zeros bundle, no sibling imports). Re-derive the six per-height
 * offsets offset_i = measuredVar_i - (1/2pi^2) log log(T_i/2pi) from the same six imp-95562
 * measured literals imp-95710/imp-95722/imp-95787 bake. For each height i, re-anchor
 * C0^(-i) = max over the remaining FIVE offsets (leave-one-out), and propagate to
 * r_cap^(-i)(3.0e12) = [ (1/2pi^2) log log(3e12/2pi) + C0^(-i) ] / Sigma^2(L(3e12)).
 * Report every leave-one-out cap and the drop-argmax cap specifically.
 *
 * FINDINGS.
 *  1. Dropping the argmax height T = 1.5e5 (offset 0.3337) RE-ANCHORS C0 to the next-highest
 *     offset 0.2854 at T = 1.0e4 -- the max estimator simply falls to the runner-up, it does
 *     NOT collapse toward the mean. So the jackknife influence of the lone anomalous height on
 *     C0 is bounded: 0.3337 -> 0.2854 (a -0.0483 = -14.5% drop, not a collapse to 0.2618).
 *  2. Propagated to the window bottom, dropping T = 1.5e5 moves r_cap(3.0e12) from 0.2599 to
 *     0.2348 -- a -0.0251 (-9.65%) shift. Dropping ANY of the other five heights leaves C0 =
 *     0.3337 and r_cap = 0.2599 UNCHANGED (the argmax is preserved), so the entire jackknife
 *     sensitivity of the cap is carried by the single T = 1.5e5 point, exactly as imp-95787
 *     diagnosed.
 *  3. Across all six leave-one-out anchors r_cap(3.0e12) spans just [0.2348, 0.2599] -- a
 *     two-valued jackknife (0.2599 for the five non-argmax drops, 0.2348 for the argmax drop)
 *     -- and EVERY leave-one-out cap sits far below the GUE asymptote 1. So the r_cap < 1
 *     conservatism SURVIVES every leave-one-out re-anchoring, including the one that removes the
 *     height that pins C0; the anomalous point makes the cap slightly MORE conservative, never
 *     the reverse.
 *
 * VERDICT. The imp-95722 max-based C0 = 0.3337 is pinned by the lone anomalous T = 1.5e5
 * height, but a leave-one-out re-anchoring that drops that height is BENIGN: C0 falls only to
 * the runner-up 0.2854 (T = 1.0e4), r_cap(3.0e12) moves from 0.2599 to 0.2348 (-9.65%), and
 * dropping any of the other five heights changes neither (the argmax is preserved). The full
 * leave-one-out cap range is [0.2348, 0.2599], all far below the GUE asymptote 1, so the
 * r_cap < 1 conservatism is INVARIANT to jackknifing out any single height -- including the
 * one that pins C0. Removing the anomalous height only tightens the cap, consistent with the
 * imp-95787 "over-estimate errs conservative" reading and the imp-95766 "robust to ~4x error"
 * headroom. Measure/assess only; the Selberg leading log log cap is unconditional; the detailed
 * saturation shape is PCC/GRH-gated; changes no bound; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * Import-light: no zeros bundle, no sibling imports. Only the six sd(C - E) literals are
 * measured (imp-95562 over the verified ordinates); every derived quantity is recomputed here
 * from the closed forms.
 */

const TWO_PI = 2 * Math.PI;
const EULER = 0.5772156649015329;

const halfWidth = (T) => Math.sqrt(T / TWO_PI); // Delta = sqrt(T/2pi)
const zeroDensity = (T) => Math.log(T / TWO_PI) / TWO_PI; // delta(T)
const envelopeCount = (T) => 2 * halfWidth(T) * zeroDensity(T); // L = 2 Delta delta(T)
const gueNumberVariance = (L) => (Math.log(TWO_PI * L) + EULER + 1) / (Math.PI * Math.PI);
const SELBERG_C = 1 / (2 * Math.PI * Math.PI); // Selberg leading variance constant
const logLog = (T) => Math.log(Math.log(T / TWO_PI));

// Same six measured literals imp-95710/imp-95722/imp-95787 bake (imp-95562 over the 10^6 Odlyzko ordinates).
const MEASURED = [
  { Tc: 1.0e4, sdDiscrepancy: 0.6218 },
  { Tc: 3.0e4, sdDiscrepancy: 0.5823 },
  { Tc: 7.0e4, sdDiscrepancy: 0.5689 },
  { Tc: 1.5e5, sdDiscrepancy: 0.6714 },
  { Tc: 3.0e5, sdDiscrepancy: 0.6199 },
  { Tc: 5.0e5, sdDiscrepancy: 0.6078 },
];

const rows = MEASURED.map((m) => {
  const measuredVar = m.sdDiscrepancy * m.sdDiscrepancy;
  const selbergTerm = SELBERG_C * logLog(m.Tc);
  return {
    Tc: m.Tc,
    measuredVariance: measuredVar,
    selbergTerm,
    offset: measuredVar - selbergTerm, // per-height windowing correction
  };
});

const offsets = rows.map((r) => r.offset);
const nH = offsets.length;
const C0_full = Math.max(...offsets); // imp-95722 upper-envelope anchor -> 0.3337
const argmaxIdx = offsets.indexOf(C0_full);
const argmaxT = MEASURED[argmaxIdx].Tc; // 1.5e5

// Propagate an offset to r_cap at the imp-95519 window bottom.
const WINDOW_BOTTOM_T = 3.0e12;
const gueVarWB = gueNumberVariance(envelopeCount(WINDOW_BOTTOM_T));
const selbergTermWB = SELBERG_C * logLog(WINDOW_BOTTOM_T);
const rCapAt = (c0) => (selbergTermWB + c0) / gueVarWB;

const rCapFull = rCapAt(C0_full); // 0.2599

// Leave-one-out: drop each height in turn, re-anchor C0 = max over the remaining five.
const leaveOneOut = rows.map((r, i) => {
  const remaining = offsets.filter((_, j) => j !== i);
  const c0 = Math.max(...remaining);
  const rc = rCapAt(c0);
  return {
    droppedT: r.Tc,
    droppedOffset: r.offset,
    reanchoredC0: c0,
    reanchoredArgmaxT: MEASURED[offsets.indexOf(c0)].Tc,
    rCap: rc,
    isArgmaxDrop: i === argmaxIdx,
    changedFromFull: Math.abs(rc - rCapFull) > 1e-12,
    belowGueAsymptote: rc < 1,
  };
});

const looRcaps = leaveOneOut.map((x) => x.rCap);
const rCapMinLoo = Math.min(...looRcaps);
const rCapMaxLoo = Math.max(...looRcaps);

// The drop-argmax anchor specifically.
const argmaxDrop = leaveOneOut[argmaxIdx];
const c0DropArgmax = argmaxDrop.reanchoredC0; // 0.2854 at T=1e4
const rCapDropArgmax = argmaxDrop.rCap; // 0.2348
const c0DeltaArgmax = C0_full - c0DropArgmax; // 0.0483
const c0DropArgmaxPct = (c0DeltaArgmax / C0_full) * 100; // 14.5%
const rCapDeltaArgmax = rCapFull - rCapDropArgmax; // 0.0251
const rCapDropArgmaxPct = (rCapDeltaArgmax / rCapFull) * 100; // 9.65%

export const IMP95800_NUMBER_VARIANCE_C0_LEAVE_ONE_OUT = {
  ticket: 'imp-95800',
  source:
    'imp-95787 F1/F2 (the max-based windowing offset C0 = 0.3337 is pinned by the single anomalous T = 1.5e5 height). The six sd(C - E) values are the imp-95562 measured literals over the 10^6 Odlyzko ordinates in src/data/zeros-to-1e6.js; the GUE/Selberg forms are re-derived here. Complementary to imp-95748 (measurement noise) and imp-95787 (max-vs-mean-vs-min estimator choice); this is the leave-one-out/jackknife robustness of the max anchor to a single-height drop.',
  definitions: {
    offset: 'per-height windowing correction offset_i = measuredVar_i - (1/2pi^2) log log(T_i/2pi)',
    c0Full: 'C0_full = max_i(offset_i): the imp-95722 upper-envelope anchor (0.3337, argmax T=1.5e5)',
    leaveOneOut: 'C0^(-i) = max over the offsets with height i removed; r_cap^(-i)(3e12) propagates each',
    argmaxDrop: 'the leave-one-out anchor that removes the argmax height T = 1.5e5 (the influential point)',
  },
  selbergConstant: SELBERG_C,
  fullAnchor: {
    c0: C0_full, // 0.3337
    argmaxT, // 1.5e5
    rCap: rCapFull, // 0.2599
  },
  leaveOneOut,
  argmaxDrop: {
    droppedT: argmaxT, // 1.5e5
    reanchoredC0: c0DropArgmax, // 0.2854 (runner-up at T=1e4)
    reanchoredArgmaxT: argmaxDrop.reanchoredArgmaxT, // 1.0e4
    c0Delta: c0DeltaArgmax, // 0.0483
    c0DropPct: c0DropArgmaxPct, // 14.5%
    rCap: rCapDropArgmax, // 0.2348
    rCapDelta: rCapDeltaArgmax, // 0.0251
    rCapDropPct: rCapDropArgmaxPct, // 9.65%
    note: 'dropping the argmax re-anchors C0 to the runner-up (T=1e4), not to the mean; the cap tightens, never loosens',
  },
  jackknife: {
    rCapRange: [rCapMinLoo, rCapMaxLoo], // [0.2348, 0.2599]
    twoValued:
      'only the argmax drop moves the cap (to 0.2348); the five non-argmax drops leave C0 = 0.3337 and r_cap = 0.2599 unchanged, since the argmax is preserved',
    conservatismInvariant: rCapMaxLoo < 1, // every leave-one-out cap far below the GUE asymptote 1
    allBelowAsymptote: leaveOneOut.every((x) => x.belowGueAsymptote),
  },
  verdict:
    'LEAVE-ONE-OUT sensitivity of the imp-95722 max-based offset C0 = 0.3337 to a drop of the anomalous T = 1.5e5 argmax height. Dropping that height re-anchors C0 to the runner-up 0.2854 (T = 1.0e4) -- a -14.5% drop, NOT a collapse to the mean 0.2618 -- and moves r_cap(3.0e12) from 0.2599 to 0.2348 (-9.65%). Dropping any of the other five heights leaves C0 and r_cap unchanged (the argmax is preserved), so the entire jackknife sensitivity is carried by the lone T = 1.5e5 point, exactly as imp-95787 diagnosed. The full leave-one-out cap range is [0.2348, 0.2599], all far below the GUE asymptote 1, so the r_cap < 1 conservatism SURVIVES every leave-one-out re-anchoring -- including the one that removes the pinning height -- and removing the anomalous point only tightens the cap. Measure/assess only; the Selberg leading log log cap is unconditional; the detailed saturation shape is PCC/GRH-gated; changes no bound; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (formula re-derivation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the full max anchor reproduces the imp-95722 pinning (~0.3337) and the imp-95787 r_cap ~0.26
  if (!approx(C0_full, 0.333721, 1e-4)) throw new Error('imp-95800: C0_full drifted from the imp-95722 pinning');
  if (!approx(rCapFull, 0.2599, 0.01)) throw new Error('imp-95800: r_cap full drifted from the imp-95722/787 0.26');
  // the argmax is the T = 1.5e5 noisy bump
  if (argmaxT !== 1.5e5) throw new Error('imp-95800: envelope argmax not at the expected T=1.5e5 height');
  // dropping the argmax re-anchors to the runner-up at T = 1e4 (~0.2854), strictly below C0_full
  if (argmaxDrop.reanchoredArgmaxT !== 1.0e4) throw new Error('imp-95800: argmax-drop did not re-anchor to T=1e4');
  if (!(c0DropArgmax < C0_full)) throw new Error('imp-95800: argmax-drop C0 not below the full C0');
  if (!approx(c0DropArgmax, 0.2854, 1e-3)) throw new Error('imp-95800: argmax-drop C0 drifted from 0.2854');
  // the argmax drop TIGHTENS the cap (r_cap falls), never loosens it
  if (!(rCapDropArgmax < rCapFull)) throw new Error('imp-95800: argmax-drop did not tighten the cap');
  if (!approx(rCapDropArgmax, 0.2348, 1e-3)) throw new Error('imp-95800: argmax-drop r_cap drifted from 0.2348');
  // exactly one leave-one-out anchor moves the cap (the argmax drop); the other five are unchanged
  const changedCount = leaveOneOut.filter((x) => x.changedFromFull).length;
  if (changedCount !== 1) throw new Error('imp-95800: expected exactly one leave-one-out anchor to move the cap');
  if (!leaveOneOut[argmaxIdx].isArgmaxDrop) throw new Error('imp-95800: the moving anchor is not the argmax drop');
  // conservatism INVARIANT: every leave-one-out cap stays far below 1
  if (!leaveOneOut.every((x) => x.belowGueAsymptote)) throw new Error('imp-95800: a leave-one-out cap crossed 1');
  if (!(rCapMaxLoo < 0.5)) throw new Error('imp-95800: a leave-one-out cap unexpectedly high -- re-check propagation');
  if (!(rCapMinLoo > 0)) throw new Error('imp-95800: a leave-one-out cap non-positive');
  // honesty gates
  if (!/NO QED/.test(IMP95800_NUMBER_VARIANCE_C0_LEAVE_ONE_OUT.verdict))
    throw new Error('imp-95800: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP95800_NUMBER_VARIANCE_C0_LEAVE_ONE_OUT.verdict))
    throw new Error('imp-95800: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95800_NUMBER_VARIANCE_C0_LEAVE_ONE_OUT;
