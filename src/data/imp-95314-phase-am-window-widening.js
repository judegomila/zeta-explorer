/**
 * @module imp-95314-phase-am-window-widening
 * @fileoverview imp-95314 -- import-light MEASUREMENT of the certified
 *   theta-window widening delivered by the imp-95254 THEOREM PHASE-AM over the
 *   imp-95233 PHASE-CERT bound. PHASE-AM lowers the vacuity frontier (the theta
 *   level below which the signed seam certificate stops firing, i.e. the bound
 *   crosses the 1/2 ceiling) from thetaCERT(y_min) = e^(-y_min) to
 *   thetaAM(y_min) = e^(-y_min)/(2 - e^(-y_min)). This leg tabulates both
 *   firing thresholds and the widening across y_min in the seam range, and
 *   reports where the widening is largest and where it is negligible.
 *   Measurement of an existing sharpening; NO bound is changed; NO QED;
 *   no refereed bound is changed.
 *
 *   BACKGROUND
 *   -----------------------------------------------
 *   In the imp-95233/95254 phase currency, the signed seam ratio R = W/T of a
 *   real-amplitude packet family is priced against two scalars: the seam depth
 *   y_min = min over pairs (incl. diagonal) of (mu_m + mu_n) min(u_m, u_n), and
 *   the phase level theta = T(f)/T(g) in (0, 1] (g the positive-modulus
 *   envelope). The certificate "fires" at a given (theta, y_min) when its bound
 *   sits strictly below the co-centered ceiling 1/2.
 *     PHASE-CERT (imp-95233): R <= e^(-y_min)/(2 theta), sub-1/2 iff
 *       theta > e^(-y_min)             =: thetaCERT(y_min).
 *     PHASE-AM (imp-95254):   R <= (e^(-y_min)/4)(1 + 1/theta), sub-1/2 iff
 *       theta > e^(-y_min)/(2 - e^(-y_min)) =: thetaAM(y_min).
 *   PHASE-AM strictly dominates PHASE-CERT (ratio (1 + theta)/2 <= 1), so its
 *   firing threshold is lower and its certified theta-window (theta, 1] is
 *   wider. The imp-95254 verdict records the frontier drop but never tabulates
 *   the resulting widening across y_min. That is this ticket.
 *
 *   Q1: FRACTIONAL (MULTIPLICATIVE) WIDENING -- factor 2 - e^(-y_min)
 *   -----------------------------------------------
 *   thetaCERT / thetaAM = 2 - e^(-y_min) EXACTLY: the PHASE-AM threshold is a
 *   factor 2 - e^(-y_min) below the PHASE-CERT threshold. This factor is
 *   monotone increasing in y_min, running from its infimum 1 as y_min -> 0
 *   (NEGLIGIBLE widening in the shallow-seam limit, where e^(-y_min) -> 1) to
 *   its supremum 2 as y_min -> infinity (widening approaching a full doubling
 *   of the frontier level at depth). At the NO-UNIF depth y_min = 2 ln 2 the
 *   factor is exactly 7/4: thetaCERT = 1/4 drops to thetaAM = 1/7 (the
 *   imp-95254 frontierOld/frontierNew literals). See WIDENING_TABLE.
 *
 *   Q2: ABSOLUTE WIDENING -- extra theta admitted, peaks at y_min ~ 0.5348
 *   -----------------------------------------------
 *   The MULTIPLICATIVE factor is largest at depth, but the ABSOLUTE amount of
 *   theta newly certified, thetaCERT - thetaAM = t(1 - t)/(2 - t) with
 *   t = e^(-y_min), vanishes at BOTH ends (t -> 1 shallow and t -> 0 deep) and
 *   is maximized in between. Its exact maximizer is t = 2 - sqrt(2), i.e.
 *   y_min* = -ln(2 - sqrt(2)) = 0.5347999967..., where the extra certified
 *   theta-band has exact width 3 - 2 sqrt(2) = 0.1715728752... So the
 *   PRACTICAL widening -- the extra slice of the phase axis the sharper bound
 *   buys -- is greatest at moderate seam depth y_min ~ 0.53, not at the depth
 *   where the fractional factor peaks. Deep seams already have a tiny thetaCERT,
 *   so halving it wins little absolute theta; shallow seams have factor ~ 1, so
 *   they win little either. See WIDENING_TABLE.absGain.
 *
 *   Q3: WHERE THE WIDENING MATTERS
 *   -----------------------------------------------
 *   Both readings agree that the shallow-seam limit y_min -> 0 is where PHASE-AM
 *   adds essentially nothing (factor -> 1, absGain -> 0): there the certificate
 *   already needs theta ~ 1 and neither bound helps in deep cancellation. The
 *   fractional gain grows without a knee toward the 2x depth asymptote; the
 *   absolute gain is a single-humped curve peaking at y_min ~ 0.53. In the
 *   documented seam witnesses: at the CEIL-X / LIN-NOGO depth y_min = 1/4 the
 *   factor is 1.2212 and absGain 0.1420; at y_min = 2 ln 2 the factor is 1.75
 *   and absGain 0.1071 (past the hump, absolute gain already declining while
 *   the fractional gain keeps rising).
 *
 *   INTERPRETATION
 *   -----------------------------------------------
 *   PHASE-AM's window widening is real but bounded: the frontier can drop by at
 *   most a factor 2 (never below thetaCERT/2), and the largest slice of newly
 *   certified phase, ~0.172 in theta, is opened at seam depth y_min ~ 0.53. The
 *   deep-cancellation region (small theta at any fixed y_min) stays uncertified
 *   -- consistent with imp-95254 COROLLARY NO-UNIF (no phase-priced bound stays
 *   sub-1/2 uniformly as theta -> 0) and PROP CEIL-X (R exceeds 1/2 at interior
 *   points). Measurement only; changes no bound of the Lambda program.
 *
 *   Import-light (no imports, no zeros bundle). All numerics are CROSS-CHECKS
 *   of the closed forms above, never a claim itself.
 */

// ---------------------------------------------------------------------------
// Closed-form firing thresholds (re-derived locally; no imports)
// ---------------------------------------------------------------------------

// PHASE-CERT vacuity frontier: sub-1/2 iff theta > e^(-y_min)
function thetaCERT(y) {
  return Math.exp(-y);
}
// PHASE-AM vacuity frontier: sub-1/2 iff theta > e^(-y_min)/(2 - e^(-y_min))
function thetaAM(y) {
  const e = Math.exp(-y);
  return e / (2 - e);
}
// multiplicative widening factor thetaCERT/thetaAM = 2 - e^(-y_min)
function wideningFactor(y) {
  return 2 - Math.exp(-y);
}
// absolute widening thetaCERT - thetaAM = t(1 - t)/(2 - t), t = e^(-y_min)
function absGain(y) {
  const t = Math.exp(-y);
  return (t * (1 - t)) / (2 - t);
}

// ---------------------------------------------------------------------------
// Exact features of the absolute-widening hump
// ---------------------------------------------------------------------------
// t(1-t)/(2-t) is maximized at t = 2 - sqrt(2) (root of t^2 - 4t + 2 = 0 in
// (0,1)), i.e. y_min* = -ln(2 - sqrt(2)); the maximal absGain there is
// 3 - 2 sqrt(2).
const ABS_MAX_YMIN = -Math.log(2 - Math.sqrt(2)); // 0.5347999967...
const ABS_MAX_VALUE = 3 - 2 * Math.sqrt(2); // 0.1715728752...
const FACTOR_AT_2LN2 = 7 / 4; // 2 - 1/4
const THETA_AM_AT_2LN2 = 1 / 7; // (1/4)/(7/4)  (imp-95254 frontierNew)
const THETA_CERT_AT_2LN2 = 1 / 4; // e^(-2 ln 2)  (imp-95254 frontierOld)

// ---------------------------------------------------------------------------
// Measured table across the seam range y_min in [0.1, 3.0]
// ---------------------------------------------------------------------------
const WIDENING_TABLE = [];
for (const y of [
  0.1, 0.25, 0.5, 2 * Math.LN2 * 0.5, 0.75, 1.0, 2 * Math.LN2, 1.5, 2.0, 2.5,
  3.0,
]) {
  WIDENING_TABLE.push({
    yMin: y,
    eNegY: Math.exp(-y),
    thetaCERT: thetaCERT(y),
    thetaAM: thetaAM(y),
    factor: wideningFactor(y),
    absGain: absGain(y),
    // certified theta-window widths (theta, 1]
    windowCERT: 1 - thetaCERT(y),
    windowAM: 1 - thetaAM(y),
  });
}

export const IMP95314_PHASE_AM_WINDOW_WIDENING = {
  id: "imp-95314",
  title:
    "Measurement: the imp-95254 THEOREM PHASE-AM certified theta-window " +
    "widening (vacuity frontier e^(-y_min) -> e^(-y_min)/(2 - e^(-y_min))) " +
    "across y_min -- fractional factor 2 - e^(-y_min) rises 1 -> 2 with depth, " +
    "absolute widening peaks at y_min ~ 0.5348 with band 3 - 2 sqrt(2)",
  question:
    "Tabulate the PHASE-CERT and PHASE-AM firing thresholds and the " +
    "fractional widening 2 - e^(-y_min) as a function of y_min in the seam " +
    "range; report where the widening is largest and where it is negligible.",
  wideningTable: WIDENING_TABLE,
  constants: {
    absMaxYmin: ABS_MAX_YMIN,
    absMaxValue: ABS_MAX_VALUE,
    factorAt2ln2: FACTOR_AT_2LN2,
    thetaAMat2ln2: THETA_AM_AT_2LN2,
    thetaCERTat2ln2: THETA_CERT_AT_2LN2,
  },
  findings: {
    q1Factor:
      "the multiplicative widening thetaCERT/thetaAM = 2 - e^(-y_min) is " +
      "monotone increasing in y_min from infimum 1 (shallow, y_min -> 0, " +
      "negligible) to supremum 2 (deep, y_min -> infinity, a full doubling of " +
      "the frontier level); at y_min = 2 ln 2 it is exactly 7/4 (1/4 -> 1/7).",
    q2AbsGain:
      "the absolute newly-certified theta-band thetaCERT - thetaAM = " +
      "t(1-t)/(2-t), t = e^(-y_min), vanishes at both ends and is maximized " +
      "at y_min* = -ln(2 - sqrt(2)) = 0.53480 with exact value 3 - 2 sqrt(2) " +
      "= 0.17157 -- the practical widening peaks at MODERATE seam depth, not " +
      "at the depth where the fractional factor peaks.",
    q3Where:
      "widening is NEGLIGIBLE as y_min -> 0 (factor -> 1, absGain -> 0); the " +
      "fractional gain rises without a knee toward the 2x depth asymptote " +
      "while the absolute gain is single-humped, peaking near y_min ~ 0.53 " +
      "then declining (at y_min = 2 ln 2 it is already down to 0.1071).",
  },
  interpretation:
    "PHASE-AM's window widening is real but bounded: the vacuity frontier " +
    "drops by at most a factor 2 and the largest slice of newly certified " +
    "phase (~0.172 in theta) opens at y_min ~ 0.53. The deep-cancellation " +
    "small-theta region stays uncertified, consistent with imp-95254 " +
    "COROLLARY NO-UNIF and PROP CEIL-X.",
  verdict:
    "MEASUREMENT only of the imp-95254 PHASE-AM sharpening. Q1 tabulated " +
    "(fractional factor 2 - e^(-y_min), 1 -> 2 with depth); Q2 answered " +
    "(absolute widening peaks at y_min* = -ln(2 - sqrt(2)) with band " +
    "3 - 2 sqrt(2)); Q3 answered (negligible shallow, capped deep). The " +
    "sub-gap imp-95212 STILL OPEN and the imp-95254 exact sharp frontier " +
    "remains OPEN. Changes no bound of the Lambda program; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light; THROW on violation)
// ---------------------------------------------------------------------------

export const IMP95314_ASSERTIONS = [
  {
    id: "imp95314-factor-identity-and-monotonicity",
    description:
      "thetaCERT/thetaAM = 2 - e^(-y_min) exactly at every table row, the " +
      "factor is strictly increasing in y_min, and it lies in (1, 2) with " +
      "limits 1 (y -> 0) and 2 (y -> infinity)",
    holds: () => {
      for (const r of WIDENING_TABLE) {
        if (Math.abs(r.thetaCERT / r.thetaAM - r.factor) > 1e-13) return false;
        if (!(r.factor > 1 && r.factor < 2)) return false;
      }
      for (let i = 1; i < WIDENING_TABLE.length; i++)
        if (!(WIDENING_TABLE[i].factor > WIDENING_TABLE[i - 1].factor))
          return false;
      // limits
      if (Math.abs(wideningFactor(0) - 1) > 1e-15) return false;
      if (!(2 - wideningFactor(40) < 1e-15)) return false;
      return true;
    },
  },
  {
    id: "imp95314-frontier-literals-at-2ln2",
    description:
      "at y_min = 2 ln 2 the PHASE-CERT frontier is 1/4 and the PHASE-AM " +
      "frontier is 1/7 (the imp-95254 frontierOld/frontierNew literals), the " +
      "factor is exactly 7/4, and PHASE-AM strictly lowers the frontier",
    holds: () => {
      const y = 2 * Math.LN2;
      if (Math.abs(thetaCERT(y) - THETA_CERT_AT_2LN2) > 1e-15) return false;
      if (Math.abs(thetaAM(y) - THETA_AM_AT_2LN2) > 1e-15) return false;
      if (Math.abs(wideningFactor(y) - FACTOR_AT_2LN2) > 1e-15) return false;
      return thetaAM(y) < thetaCERT(y);
    },
  },
  {
    id: "imp95314-abs-gain-hump-exact-max",
    description:
      "the absolute widening t(1-t)/(2-t) is maximized at " +
      "y_min* = -ln(2 - sqrt(2)) = 0.53480 with exact value 3 - 2 sqrt(2) = " +
      "0.17157, beating every table row and a dense grid scan, and vanishes " +
      "at both the shallow and deep ends",
    holds: () => {
      if (Math.abs(absGain(ABS_MAX_YMIN) - ABS_MAX_VALUE) > 1e-13) return false;
      // dense grid: nothing exceeds the closed-form maximum
      let gmax = 0;
      for (let y = 0.001; y < 8; y += 0.0005) gmax = Math.max(gmax, absGain(y));
      if (gmax > ABS_MAX_VALUE + 1e-6) return false;
      // vanishes at both ends
      if (!(absGain(0) < 1e-15)) return false; // t = 1 shallow
      if (!(absGain(40) < 1e-15)) return false; // t -> 0 deep
      // every table row is at or below the exact max
      if (!WIDENING_TABLE.every((r) => r.absGain <= ABS_MAX_VALUE + 1e-13))
        return false;
      return true;
    },
  },
  {
    id: "imp95314-am-window-strictly-wider",
    description:
      "the PHASE-AM certified theta-window (thetaAM, 1] strictly contains the " +
      "PHASE-CERT window (thetaCERT, 1] at every y_min > 0: thetaAM < " +
      "thetaCERT and windowAM > windowCERT by exactly absGain",
    holds: () =>
      WIDENING_TABLE.every(
        (r) =>
          r.thetaAM < r.thetaCERT &&
          r.windowAM > r.windowCERT &&
          Math.abs(r.windowAM - r.windowCERT - r.absGain) < 1e-13,
      ),
  },
  {
    id: "imp95314-verdict-honesty",
    description:
      "the record carries the honest labels: measurement only, sub-gap still " +
      "open, no bound change, no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT only/.test(IMP95314_PHASE_AM_WINDOW_WIDENING.verdict) &&
      /STILL OPEN/.test(IMP95314_PHASE_AM_WINDOW_WIDENING.verdict) &&
      /Changes no bound/.test(IMP95314_PHASE_AM_WINDOW_WIDENING.verdict) &&
      /NO QED/.test(IMP95314_PHASE_AM_WINDOW_WIDENING.verdict) &&
      /refereed bound is changed/i.test(IMP95314_PHASE_AM_WINDOW_WIDENING.verdict),
  },
];

for (const a of IMP95314_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95314-phase-am-window-widening assertion failed: ${a.id}`,
    );
  }
}

export default IMP95314_PHASE_AM_WINDOW_WIDENING;
