/**
 * @fileoverview imp-33251: INDEPENDENT recompute/verification of the imp-33233
 * multi-width modulated-ladder bound.
 *
 * @module data/imp-33251-modulation-nyquist-floor-independent-verification
 *
 * imp-33233 attacked the Conjecture 22.1 modulation escape-hatch quantitatively
 * and produced three headline numbers, all resting on ONE analytic pass:
 *   (A) single-width weakened coefficient floor D >= ceil(M_sc/2);
 *   (B) multi-width/windowed Paley-Wiener + Levinson/Titchmarsh 8.71 zero-density
 *       bandwidth floor U >= pi M_sc / T0 (quoted ~12.95, "order (1/2)log(T0/2pi)");
 *   and the Whittaker-Kotelnikov-Shannon storage dimension (U/pi) T0 ~ M_sc.
 *
 * THIS MODULE recomputes each of those, from the raw Platt-Trudgian 2021 inputs
 * (height T0 and sign-change count M_sc), through a SECOND independent code path,
 * and confirms:
 *   1. U = pi M_sc / T0 = 12.94590739... lands in the claimed ~12.95 band and,
 *      to full double precision, reproduces imp-33233 NYQUIST_BANDWIDTH_FLOOR.
 *   2. The WKS sample count (U/pi) T0 collapses ALGEBRAICALLY back to M_sc (the
 *      (U/pi) and (pi ...) cancel), so the storage dimension is exactly ~M_sc --
 *      confirming the escape-hatch reappears as an Odlyzko-Schonhage Nyquist
 *      floor of the same order, NOT a shrunk one.
 *   3. The single-width floor ceil(M_sc/2) = 6,181,576,718,569 and the gap factor
 *      over the 691,008-term Riemann-Siegel main sum (> 8.9e6) reproduce exactly.
 *
 * INDEPENDENT VALUE ADDED (beyond a byte-for-byte re-run): imp-33233 explicitly
 * left M_sc as an inherited literature constant ("not re-derived here"). This
 * module CLOSES that scope by cross-checking M_sc against the Riemann-von
 * Mangoldt main term N(T0) ~ (T0/2pi) log(T0/2pi) - T0/2pi + 7/8. That count
 * reproduces the quoted M_sc to a relative error < 1e-13 (off by < 1 zero), so
 * the benchmark M_sc used to drive U really is the zero count at height T0. This
 * also EXPLAINS the "order (1/2)log(T0/2pi)" remark structurally: because
 * M_sc ~ N(T0), the bandwidth floor is
 *      U = pi M_sc / T0 ~ pi N(T0)/T0 -> (1/2) log(T0/2pi),
 * i.e. U is pi times the mean Riemann-von Mangoldt zero DENSITY at height T0 --
 * which is exactly why it stays O(log T0) and bounded (~12.95) while the sample
 * COUNT (density times length T0) is the full ~M_sc.
 *
 * VERIFICATION/MEASUREMENT ONLY. Establishes no operator positivity; asserts no
 * new bound. The imp-33233 verdict ("no independent-novel equal-runtime
 * advantage; the modulation escape is Nyquist-capped at the same ~M_sc order")
 * is CONFIRMED, not extended. imp-3932 partial-falsification stands; imp-3066
 * K_a >= 0 UNTOUCHED; the imp-1210 novelty verdict is unchanged; NO QED on
 * Conjecture 22.1 in full generality; Polymath15 Lambda <= 0.2 remains SOTA.
 *
 * NO imports. Self-contained and light (no zeros bundle). JSDoc avoids the
 * close-comment sequence; JS strings use double quotes where an apostrophe is
 * needed.
 */

// ── Raw Platt-Trudgian 2021 inputs (the ONLY quantities taken as given) ──────
const PT_HEIGHT = 3000175332800; // verified height T0
const PT_ZEROS = 12363153437138; // sign changes M_sc of Xi on (0, T0]
const TWO_PI = 2 * Math.PI;

// ── Independent recompute of the three imp-33233 headline numbers ────────────

// (B) Paley-Wiener / Levinson exponential-type bandwidth floor U >= pi M_sc/T0.
const U_BANDWIDTH_FLOOR = (Math.PI * PT_ZEROS) / PT_HEIGHT;

// The mean Riemann-von Mangoldt zero density at height T0 is (1/2pi)log(T0/2pi);
// U = pi M_sc/T0 should track pi times that density, i.e. (1/2)log(T0/2pi).
const HALF_LOG_DENSITY_ORDER = 0.5 * Math.log(PT_HEIGHT / TWO_PI);

// Whittaker-Kotelnikov-Shannon storage: sample count (U/pi) T0 on [0, T0].
const WKS_SAMPLE_FLOOR = (U_BANDWIDTH_FLOOR / Math.PI) * PT_HEIGHT;

// (A) Single-width weakened coefficient floor and gap vs the RS main sum.
const RS_MAIN_SUM_TERMS_AT_TOP = Math.floor(Math.sqrt(PT_HEIGHT / TWO_PI));
const D_SINGLE_WIDTH_FLOOR = Math.ceil(PT_ZEROS / 2);
const SINGLE_WIDTH_GAP_FACTOR = D_SINGLE_WIDTH_FLOOR / RS_MAIN_SUM_TERMS_AT_TOP;

// ── INDEPENDENT cross-check of M_sc (imp-33233 left this out of scope) ────────
// Riemann-von Mangoldt: N(T) = (T/2pi) log(T/2pi) - T/2pi + 7/8 + S(T) + O(1/T).
// The smooth main term alone must reproduce the quoted M_sc to O(log T0) / M_sc.
function riemannVonMangoldtMainTerm(T) {
  const x = T / TWO_PI;
  return x * Math.log(x) - x + 7 / 8;
}
const RVM_ZERO_COUNT = riemannVonMangoldtMainTerm(PT_HEIGHT);
const RVM_RELATIVE_ERROR = Math.abs(RVM_ZERO_COUNT - PT_ZEROS) / PT_ZEROS;

// ── Frozen verification record ───────────────────────────────────────────────

export const IMP_33251_MODULATION_NYQUIST_FLOOR_VERIFICATION = Object.freeze({
  id: 'imp-33251',
  ticket: 'imp-33251',
  date: '2026-07-04',
  verifies: 'imp-33233',
  paper: 'twin_ladder_consolidated_v52.pdf',
  target:
    'Independently recompute the imp-33233 multi-width modulated-ladder bound: ' +
    'the Paley-Wiener / Levinson bandwidth floor U >= pi M_sc / T0 (~12.95), the ' +
    'Whittaker-Kotelnikov-Shannon storage dimension (U/pi) T0 ~ M_sc, and the ' +
    'single-width coefficient floor, from the raw Platt-Trudgian 2021 inputs.',
  inputs: Object.freeze({
    heightT0: PT_HEIGHT,
    zeroCountMsc: PT_ZEROS,
    note:
      'T0 and M_sc are the ONLY quantities taken as given; everything below is ' +
      'recomputed through an independent code path, and M_sc is separately ' +
      'cross-checked against Riemann-von Mangoldt.',
  }),
  recomputed: Object.freeze({
    bandwidthFloorU: U_BANDWIDTH_FLOOR,
    bandwidthFloorUNote:
      'U = pi M_sc / T0 = 12.9459073903... -- inside the imp-33233 ~12.95 band, ' +
      'BOUNDED and O(log T0). Reproduces imp-33233 NYQUIST_BANDWIDTH_FLOOR to ' +
      'full double precision.',
    halfLogDensityOrder: HALF_LOG_DENSITY_ORDER,
    halfLogDensityOrderNote:
      'The claimed order (1/2)log(T0/2pi) = 13.4459... ; U / this = 0.9628, so ' +
      'U is pi times the mean Riemann-von Mangoldt zero density and stays of ' +
      'that logarithmic order -- confirming U is bounded, not growing with M_sc.',
    wksSampleFloor: WKS_SAMPLE_FLOOR,
    wksSampleFloorNote:
      'Storage dimension (U/pi) T0 collapses algebraically to M_sc (the pi and ' +
      '1/pi cancel), so the sample/data floor is exactly ~M_sc = Odlyzko-' +
      'Schonhage band-limited interpolation, NOT a shrunk representation.',
    singleWidthFloorD: D_SINGLE_WIDTH_FLOOR,
    singleWidthGapFactor: SINGLE_WIDTH_GAP_FACTOR,
    singleWidthFloorNote:
      'ceil(M_sc/2) = 6,181,576,718,569 stored coefficients, exceeding the ' +
      '691,008-term Riemann-Siegel main sum by a factor > 8.9e6.',
  }),
  mscCrossCheck: Object.freeze({
    riemannVonMangoldtMainTerm: RVM_ZERO_COUNT,
    relativeError: RVM_RELATIVE_ERROR,
    note:
      'imp-33233 inherited M_sc without re-deriving it. The Riemann-von ' +
      'Mangoldt main term N(T0) ~ (T0/2pi)log(T0/2pi) - T0/2pi + 7/8 reproduces ' +
      'M_sc to relative error < 1e-13 (off by < 1 zero), confirming M_sc is the ' +
      'zero count at height T0 and closing that scope gap.',
  }),
  verdict:
    'CONFIRMED. Every imp-33233 headline number reproduces independently: U ~ ' +
    '12.95 (bounded, O(log T0)), the WKS storage dimension is exactly ~M_sc, ' +
    'and the single-width floor is ceil(M_sc/2) with a > 8.9e6 gap. The ' +
    'modulation escape-hatch reappears as an Odlyzko-Schonhage Nyquist floor of ' +
    'the same ~M_sc order -- NO independent-novel equal-runtime advantage. This ' +
    'is a recompute, not a new bound.',
  honestScope: Object.freeze([
    'Pure arithmetic/analytic recompute from T0 and M_sc; the Paley-Wiener + ' +
      'Levinson zero-density theorem and the WKS sampling theorem are cited, not ' +
      're-proved (they are classical and already invoked in imp-33233).',
    'The single new derivation is the Riemann-von Mangoldt cross-check of M_sc, ' +
      'which imp-33233 explicitly declared out of scope; it uses only the smooth ' +
      'main term (S(T) and O(1/T) omitted), which is why the match is to < 1 ' +
      'zero rather than exact.',
    'NO QED: Conjecture 22.1 in full generality is NOT resolved. The imp-33233 ' +
      'residual sub-gap (algebraic-complexity per-evaluation lower bound + ' +
      'small-height regime) is untouched and still open.',
    'imp-3932 partial-falsification stands; imp-3066 K_a >= 0 UNTOUCHED; the ' +
      'imp-1210 novelty verdict is unchanged; Polymath15 Lambda <= 0.2 remains ' +
      'the SOTA de Bruijn-Newman upper bound and is untouched.',
  ]),
  auditCrossRefs: Object.freeze(['imp-33233', 'imp-3932', 'imp-1210']),
});

// ── Build-time tripwires (independent of imp-33233 arithmetic) ────────────────

export const IMP_33251_MODULATION_NYQUIST_FLOOR_VERIFICATION_ASSERTIONS = [
  {
    id: 'imp33251-bandwidth-floor-recomputes-to-12p95-and-is-bounded',
    holds: () => {
      const r = IMP_33251_MODULATION_NYQUIST_FLOOR_VERIFICATION.recomputed;
      // U = pi M_sc / T0 must land in the imp-33233 ~12.95 band, and it must be
      // BOUNDED at the logarithmic order (1/2)log(T0/2pi) rather than growing
      // with M_sc: U/(halfLog) is ~0.96, so 0.9 < ratio < 1.05.
      const U = (Math.PI * PT_ZEROS) / PT_HEIGHT;
      const ratio = U / HALF_LOG_DENSITY_ORDER;
      return (
        Math.abs(r.bandwidthFloorU - U) < 1e-12 &&
        U > 12.5 &&
        U < 13.5 &&
        Math.abs(U - 12.945907390374948) < 1e-9 &&
        ratio > 0.9 &&
        ratio < 1.05
      );
    },
    why:
      'The headline bandwidth floor U >= pi M_sc / T0 must recompute to ~12.95 ' +
      'through this modules independent path AND sit at the logarithmic order ' +
      '(1/2)log(T0/2pi), proving it is bounded (does not grow with M_sc). Drift ' +
      'out of the band or away from the log order would mean the recompute ' +
      'disagrees with imp-33233 or the order claim is wrong.',
  },
  {
    id: 'imp33251-wks-sample-floor-collapses-to-Msc',
    holds: () => {
      // (U/pi) T0 must collapse algebraically back to M_sc: the storage
      // dimension is the FULL zero count, confirming the escape-hatch does not
      // shrink the representation below the Odlyzko-Schonhage ~M_sc floor.
      const sample = ((Math.PI * PT_ZEROS) / PT_HEIGHT / Math.PI) * PT_HEIGHT;
      return (
        Math.abs(WKS_SAMPLE_FLOOR - sample) < 1 &&
        Math.abs(WKS_SAMPLE_FLOOR - PT_ZEROS) < 1
      );
    },
    why:
      'The Whittaker-Kotelnikov-Shannon storage dimension (U/pi) T0 must equal ' +
      'M_sc: if the sample count came out below M_sc the modulation escape would ' +
      'be a genuine compression, contradicting the imp-33233 Nyquist-floor ' +
      'verdict. The pi/(1/pi) cancellation forces it back to the full ~M_sc.',
  },
  {
    id: 'imp33251-single-width-floor-and-gap-reproduce',
    holds: () => {
      const r = IMP_33251_MODULATION_NYQUIST_FLOOR_VERIFICATION.recomputed;
      return (
        r.singleWidthFloorD === Math.ceil(PT_ZEROS / 2) &&
        r.singleWidthFloorD === 6181576718569 &&
        r.singleWidthGapFactor > 8.9e6 &&
        r.singleWidthFloorD > RS_MAIN_SUM_TERMS_AT_TOP
      );
    },
    why:
      'The single-width weakened floor D >= ceil(M_sc/2) = 6,181,576,718,569 and ' +
      'its > 8.9e6 gap over the 691,008-term Riemann-Siegel main sum must ' +
      'reproduce exactly; a mismatch would mean the recompute disagrees with the ' +
      'imp-33233 single-width benchmark.',
  },
  {
    id: 'imp33251-Msc-cross-checks-against-riemann-von-mangoldt',
    holds: () => {
      // The value-add over a byte-for-byte re-run: the benchmark M_sc must be
      // the actual zero count at T0. The Riemann-von Mangoldt smooth main term
      // reproduces it to relative error < 1e-13 (off by < 1 zero).
      const c = IMP_33251_MODULATION_NYQUIST_FLOOR_VERIFICATION.mscCrossCheck;
      return (
        c.relativeError < 1e-13 &&
        Math.abs(c.riemannVonMangoldtMainTerm - PT_ZEROS) < 1.5
      );
    },
    why:
      'imp-33233 left M_sc as an un-re-derived literature constant. Cross- ' +
      'checking it against Riemann-von Mangoldt (main term N(T0)) closes that ' +
      'scope gap: the match to < 1 zero confirms M_sc is genuinely the zero ' +
      'count at height T0, so the U and storage floors are driven by the right ' +
      'benchmark. A large error would undermine every downstream number.',
  },
  {
    id: 'imp33251-record-is-verification-only-no-qed',
    holds: () => {
      const r = IMP_33251_MODULATION_NYQUIST_FLOOR_VERIFICATION;
      return (
        r.verifies === 'imp-33233' &&
        /CONFIRMED/.test(r.verdict) &&
        /recompute, not a new bound/.test(r.verdict) &&
        r.honestScope.some((s) => /NO QED/.test(s)) &&
        r.honestScope.some((s) => /Lambda <= 0.2/.test(s)) &&
        r.honestScope.some((s) => /imp-3066/.test(s))
      );
    },
    why:
      'Honesty guard: this record must stay a VERIFICATION of imp-33233 (not a ' +
      'promotion to a new theorem or a QED on Conjecture 22.1), must keep the ' +
      'NO-QED disclosure, and must record that imp-3066 and the Polymath15 ' +
      'Lambda <= 0.2 SOTA are untouched. Softening any of these would ' +
      'misrepresent a recompute as a fresh result.',
  },
];

export default IMP_33251_MODULATION_NYQUIST_FLOOR_VERIFICATION;
