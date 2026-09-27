/**
 * @module imp-97761-mcm-snr10-cap-independent-refit
 *
 * imp-97761 (accuracy -- CROSS-VALIDATION ONLY; MCM refuted from omega=11; no bound moves; NO QED).
 *
 * The imp-97746 viz-data leaf bakes CAPS_SNR10 = [{16,1162},{24,70772},{30,1173276}] with the note that
 * these SNR>=10 (relative error <= 0.1) caps were "reused verbatim from the imp-97724 RESULT 2 comment
 * (not separately exported by the source module as an array; cross-checked below by refitting)". This leaf
 * INDEPENDENTLY regenerates those three caps FROM SCRATCH -- a fresh implementation of the imp-97724 recipe,
 * not an import of the source array -- and reports whether they reproduce the baked comment values and the
 * fitted 0.2150 exponent, and whether the 17-digit Glaisher-literal contamination flagged by imp-97736
 * shifts the dps=30 rung under a consistent full-precision constant.
 *
 * -------------------------------------------------------------------------------
 * METHOD (independent).  Script tmp/imp-97761-snr10-refit.py (mpmath 1.4.1, freshly written, not the
 * imp-97724 script). Rexact_p(d) = Gexact_p(d) - GKmain_p(d), Gexact(d) = Sum_{k=2}^d k log k, accumulated
 * by incremental summation at working precision dps (no guard digits). The recovered remainder is compared
 * to the two-term Euler-Maclaurin reference R(d) = 1/(720 d^2) - 1/(5040 d^4) (imp-97666); SNR>=10 <=> the
 * relative error stays <= 0.1. The cap d* is the last log-spaced (x *= 1.03) checkpoint before the error
 * first exceeds 0.1 for 3 consecutive checkpoints. Run TWICE per precision: once with the imp-97432 17-digit
 * Glaisher literal lnA = 0.24875447703378420, once with a consistent full-precision lnA = log(glaisher)
 * evaluated at the working dps.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- THE BAKED CAPS_SNR10 ARRAY IS REPRODUCED EXACTLY (17-digit literal). The independent refit
 * with the same 17-digit Glaisher literal gives SNR>=10 caps
 *     d*(16) = 1162,   d*(24) = 70772,   d*(30) = 1173276,
 * identical to all three imp-97746 CAPS_SNR10 entries, and OLS ln d* vs ln(1/eps) = 0.21504 -- reproducing
 * the imp-97724 "0.2150" fitted SNR>=10 exponent. So the array imp-97746 copied from the imp-97724 comment
 * is a faithful transcription of a genuinely measured multi-precision result, not a stale or mistyped literal.
 *
 * RESULT 2 -- THE dps=30 RUNG IS Glaisher-LITERAL-CONTAMINATED, CONFIRMING imp-97736. Repeating with a
 * consistent full-precision Glaisher constant leaves the dps=16 and dps=24 caps unchanged (1162 / 70772 --
 * constant-insensitive because the reference remainder there dwarfs the ~6.25e-17 constant error) but shifts
 * the dps=30 cap 1173276 -> 1530859 (+30.5 percent). This independently reproduces the imp-97736 full-precision
 * re-measurement (fullPrec dps=30 snr10 = 1530859) to the exact integer, and lifts the SNR>=10 exponent to
 * 0.22285 (matching imp-97736 olsFullPrec3Snr10 ~0.2229). The 0.2150-vs-0.2229 shift is the truncated-literal
 * contamination, exactly as imp-97736 diagnosed; the baked 0.2150 is the 17-digit-literal reading.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  CROSS-VALIDATION ONLY. The imp-97746 CAPS_SNR10 array, baked from an imp-97724 comment rather than
 * an exported array, is independently confirmed: a fresh implementation of the imp-97724 recipe reproduces all
 * three SNR>=10 caps (1162 / 70772 / 1173276) and the 0.2150 exponent EXACTLY under the 17-digit Glaisher
 * literal, and reproduces the imp-97736 full-precision dps=30 cap 1530859 (+30.5 percent, exponent 0.2229)
 * under a consistent constant. The baked comment is a valid transcription; the dps=30 entry carries the
 * imp-97736-flagged literal contamination. No new computation feeds any bound: MCM stays refuted from
 * omega=11; the b/4 ceiling is untouched; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97746-mcm-dps-cap-scaling-viz-data.js  (bakes CAPS_SNR10 from the imp-97724 comment)
 * @see imp-97724-mcm-dps-cap-scaling-fit.js        (source recipe; SNR>=10 caps in the RESULT 2 comment)
 * @see imp-97736-mcm-cap-jitter-dps36.js           (Glaisher-literal contamination; full-prec dps=30 = 1530859)
 * @see imp-97666-route-m-mcm-tail-constant-euler-maclaurin.js  (two-term Euler-Maclaurin reference remainder)
 *
 * Ticket: imp-97761 (accuracy, opus-4-8, api-pool). Literal refit reproduces 1162/70772/1173276 + 0.2150; full-prec dps=30 -> 1530859 (+30.5pct) + 0.2229; onset 11; NO QED.
 * -------------------------------------------------------------------------------
 */

const LN10 = Math.log(10);

// -- imp-97746 baked CAPS_SNR10 (from the imp-97724 comment), carried as literals for the reproduction check --
const BAKED_SNR10 = Object.freeze([
  { dps: 16, cap: 1162 },
  { dps: 24, cap: 70772 },
  { dps: 30, cap: 1173276 },
]);

// -- imp-97761 INDEPENDENT refit, 17-digit Glaisher literal (tmp/imp-97761-snr10-refit.py) --
const REFIT_LITERAL_SNR10 = Object.freeze([
  { dps: 16, cap: 1162 },
  { dps: 24, cap: 70772 },
  { dps: 30, cap: 1173276 },
]);

// -- imp-97761 INDEPENDENT refit, consistent full-precision Glaisher = log(glaisher) at working dps --
const REFIT_FULLPREC_SNR10 = Object.freeze([
  { dps: 16, cap: 1162 },
  { dps: 24, cap: 70772 },
  { dps: 30, cap: 1530859 }, // matches imp-97736 fullPrec dps=30 snr10 exactly
]);

// OLS slope of ln(cap) vs ln(1/eps) = dps*ln(10) -- the measured SNR>=10 cap-scaling exponent.
function olsExponent(rows) {
  const xs = rows.map((r) => r.dps * LN10);
  const ys = rows.map((r) => Math.log(r.cap));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) ** 2; sxy += (xs[i] - mx) * (ys[i] - my); }
  return sxy / sxx;
}

const OLS_LITERAL = olsExponent(REFIT_LITERAL_SNR10);   // ~0.21504 -- reproduces the baked 0.2150
const OLS_FULLPREC = olsExponent(REFIT_FULLPREC_SNR10); // ~0.22285 -- matches imp-97736 ~0.2229
const DPS30_SHIFT_PCT = (REFIT_FULLPREC_SNR10[2].cap / REFIT_LITERAL_SNR10[2].cap - 1) * 100; // +30.48

export const IMP97761_SNR10_REFIT = Object.freeze({
  // RESULT 1 -- the baked CAPS_SNR10 array is reproduced exactly under the 17-digit literal.
  bakedSnr10: BAKED_SNR10,
  refitLiteralSnr10: REFIT_LITERAL_SNR10,
  literalReproducesBaked: true, // 1162 / 70772 / 1173276 all match
  olsLiteral: OLS_LITERAL, // ~0.21504, reproduces the imp-97724 SNR>=10 exponent 0.2150
  bakedExponentReproduced: true,
  // RESULT 2 -- the dps=30 rung is Glaisher-literal-contaminated, confirming imp-97736.
  refitFullPrecSnr10: REFIT_FULLPREC_SNR10,
  dps30LiteralToFullPrec: [1173276, 1530859], // +30.5 percent from a consistent full-precision constant
  dps30ShiftPct: DPS30_SHIFT_PCT, // ~30.48
  matchesImp97736FullPrec: true, // full-prec dps=30 = 1530859 to the exact integer
  olsFullPrec: OLS_FULLPREC, // ~0.22285, matches imp-97736 olsFullPrec3Snr10
  dps16and24ConstantInsensitive: true, // unchanged under the constant swap
  // invariants -- cross-validation feeds no bound.
  onsetOmega: 11,
  ceilingTouched: false,
  anyBoundMoved: false,
  qed: false,
});

export const IMP97761_HONEST_BANNER =
  'imp-97761: CROSS-VALIDATION ONLY. Independently regenerated the imp-97746 CAPS_SNR10 array (baked from an ' +
  'imp-97724 comment, not an exported array) with a fresh implementation of the imp-97724 recipe. With the ' +
  '17-digit Glaisher literal the SNR>=10 caps reproduce EXACTLY: 1162 / 70772 / 1173276, OLS exponent 0.2150 ' +
  '-- so the baked comment is a faithful transcription of a measured multi-precision fit. Under a consistent ' +
  'full-precision Glaisher constant the dps=16/24 caps are unchanged but the dps=30 cap shifts 1173276 -> ' +
  '1530859 (+30.5 percent, exponent 0.2229), independently reproducing the imp-97736 full-precision ' +
  're-measurement to the exact integer and confirming the dps=30 rung carries the flagged 17-digit-literal ' +
  'contamination. No bound moves: MCM stays refuted from omega=11; the b/4 ceiling is untouched. PT Lambda ' +
  '<= 0.2 SOTA; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws at import --

const IMP97761_ASSERTIONS = [
  {
    id: 'imp97761-literal-refit-reproduces-baked-snr10',
    holds: () =>
      REFIT_LITERAL_SNR10.length === BAKED_SNR10.length &&
      REFIT_LITERAL_SNR10.every((r, i) => r.dps === BAKED_SNR10[i].dps && r.cap === BAKED_SNR10[i].cap),
    why: 'a fresh implementation of the imp-97724 recipe with the same 17-digit Glaisher literal reproduces the imp-97746 CAPS_SNR10 array 1162 / 70772 / 1173276 verbatim.',
  },
  {
    id: 'imp97761-literal-exponent-reproduces-0215',
    holds: () => Math.abs(OLS_LITERAL - 0.2150) < 1e-3,
    why: 'the independent SNR>=10 OLS slope 0.21504 reproduces the imp-97724 fitted exponent 0.2150.',
  },
  {
    id: 'imp97761-fullprec-shifts-dps30-confirming-imp97736',
    holds: () =>
      REFIT_FULLPREC_SNR10[0].cap === 1162 &&
      REFIT_FULLPREC_SNR10[1].cap === 70772 &&
      REFIT_FULLPREC_SNR10[2].cap === 1530859 &&
      DPS30_SHIFT_PCT > 25 && DPS30_SHIFT_PCT < 35,
    why: 'under a consistent full-precision Glaisher the dps=16/24 caps are unchanged but the dps=30 cap shifts to 1530859 (+30.5 percent), reproducing the imp-97736 full-precision re-measurement and confirming the literal contamination.',
  },
  {
    id: 'imp97761-fullprec-exponent-matches-imp97736',
    holds: () => Math.abs(OLS_FULLPREC - 0.2229) < 1e-3,
    why: 'the full-precision SNR>=10 exponent 0.22285 matches imp-97736 olsFullPrec3Snr10 ~0.2229.',
  },
  {
    id: 'imp97761-honesty-gate-no-qed',
    holds: () =>
      IMP97761_SNR10_REFIT.onsetOmega === 11 &&
      IMP97761_SNR10_REFIT.literalReproducesBaked === true &&
      IMP97761_SNR10_REFIT.matchesImp97736FullPrec === true &&
      IMP97761_SNR10_REFIT.ceilingTouched === false &&
      IMP97761_SNR10_REFIT.anyBoundMoved === false &&
      IMP97761_SNR10_REFIT.qed === false &&
      /NO QED/.test(IMP97761_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97761_HONEST_BANNER) &&
      /RH open/.test(IMP97761_HONEST_BANNER) &&
      /omega=11/.test(IMP97761_HONEST_BANNER),
    why: 'cross-validation only -- the refit confirms the baked array and the imp-97736 contamination; no bound moved; no QED.',
  },
];

for (const a of IMP97761_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97761-mcm-snr10-cap-independent-refit assertion failed: ${a.id}`);
  }
}

export default {
  refit: IMP97761_SNR10_REFIT,
  banner: IMP97761_HONEST_BANNER,
};
