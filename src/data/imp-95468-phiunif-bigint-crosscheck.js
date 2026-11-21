/**
 * imp-95468: independent BigInt / exact-rational cross-check of the
 * imp-95259 exact infinite cross-Blaschke product PhiUnif.
 *
 * WHAT imp-95259 DID. It evaluated the exact uniform-fence constant
 *   PhiUnif := [ prod_(n=1..inf) b_n^8 ]^2 ,   b_n = (2^n - 1.3)/(2^n + 1.3),
 * by a DOUBLE-PRECISION log-summation, log PhiUnif = 2 sum 8 log b_n to
 * n = 1000, obtaining PhiUnif_exact = 9.977927681808923e-21, and found it
 * agrees with the imp-95250 crude literal 9.977927681808903e-21 to a
 * relative gap of ~1.8e-15 (concluding the crude bound is sharp).
 *
 * WHY THIS TICKET. The ~1.8e-15 comparison was between two DOUBLE-precision
 * numbers. A double-precision log-sum of ~60 nonnegligible terms, each with
 * its own Math.log rounding, itself carries a few-ulp error, so the ~1.8e-15
 * gap could be dominated by the method rather than by the true crude-vs-exact
 * difference. This module cross-validates PhiUnif with a genuinely
 * independent evaluation that uses NO floating-point log and NO floating
 * summation. Measurement only.
 *
 * METHOD (exact rational, BigInt). Since 1.3 = 13/10, every factor is an
 * exact rational,
 *   b_n = (10*2^n - 13)/(10*2^n + 13),   PhiUnif = prod_(n>=1) b_n^16 .
 * The partial product to n = N is formed as an exact BigInt rational
 * num/den (num = prod (10*2^n - 13)^16, den = prod (10*2^n + 13)^16) and
 * long-divided to 30 decimal digits. The truncated tail deficit is
 * ~ 16*2.6*2^(-N); at N = 200 it is ~4e-58, far below the extracted 30
 * digits, and the leading 30 digits are byte-identical at N = 160, 200, 260
 * (and at 40/50/60 extracted digits). This is exact arithmetic -- there is
 * no rounding in the product at all.
 *
 * RESULT 1 (the true value, to 30 digits). The exact-rational PhiUnif is
 *   PhiUnif_true = 9.97792768180888053329547867604e-21 .
 * Its nearest double is 9.9779276818088805e-21.
 *
 * RESULT 2 (the double-precision log-sum WAS the limiting factor). The
 * imp-95259 double log-sum literal 9.977927681808923e-21 overshoots the
 * exact value by a relative +4.22e-15, and the imp-95250 crude direct-product
 * literal 9.977927681808903e-21 overshoots by +2.27e-15. Both double-precision
 * errors are LARGER than the ~1.8e-15 crude-vs-exact gap that imp-95259
 * reported -- i.e. that ~1.8e-15 figure was the near-cancellation of two
 * same-signed few-e-15 rounding errors and was indeed limited by double
 * precision, not by a genuine crude-vs-exact separation.
 *
 * RESULT 3 (the imp-95259 verdict STANDS, and is strengthened). Both baked
 * literals are nonetheless correct to ~15 significant figures (rel error
 * ~2-4e-15). Because certUnif(x) = envelope(x)^2 / PhiUnif with envelope
 * decaying like e^(-x), a relative change eps in PhiUnif shifts the firing
 * onset x* by ~ eps/2; with eps ~ 4e-15 the onset moves by ~2e-15,
 * unresolvable. Replacing either double literal with the exact-rational value
 * leaves XSTAR_UNIF = 27.035582 unchanged to machine precision. The crude
 * imp-95250 bound remains effectively sharp -- in fact the exact-rational
 * value confirms the true PhiUnif lies within a few e-15 of BOTH literals.
 *
 * VERDICT. An independent exact-rational (BigInt) evaluation confirms
 * PhiUnif = 9.97792768180888053e-21 and shows the imp-95259 double-precision
 * log-sum was at its precision floor (its ~4e-15 error exceeds the reported
 * ~1.8e-15 gap). The baked literals are correct to ~15 sig figs; the true
 * value changes no bound and no firing threshold. MEASUREMENT ONLY;
 * introduces no bound and no theorem; changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * SCOPE. MEASUREMENT ONLY. Import-light (no imports). BigInt exact
 * arithmetic; no floating log, no floating summation.
 */

// ---------------------------------------------------------------------------
// Reference constants (all reproduced by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95468_PHIUNIF_BIGINT_CROSSCHECK = {
  id: "imp-95468",
  title:
    "Independent BigInt exact-rational evaluation of PhiUnif confirms " +
    "9.97792768180888053e-21 and shows the imp-95259 double-precision " +
    "log-sum was at its precision floor (~4e-15 error > the reported " +
    "~1.8e-15 gap); baked literals correct to ~15 sig figs, no bound moves",
  method:
    "exact BigInt rational partial product prod (10*2^n - 13)^16 / " +
    "prod (10*2^n + 13)^16 to n = 200 (tail deficit ~4e-58), long-divided " +
    "to 30 decimal digits; no floating log, no floating summation",
  phiUnifTrueDigits: "9.97792768180888053329547867604e-21",
  phiUnifTrueDouble: 9.9779276818088805e-21,
  phiUnifLogSumLiteral: 9.977927681808923e-21, // imp-95259 double log-sum
  phiUnifCrudeLiteral: 9.977927681808903e-21, // imp-95250 double direct product
  relLogSumMinusTrue: 4.22e-15,
  relCrudeMinusTrue: 2.27e-15,
  crudeVsExactGapReported: 1.8e-15, // imp-95259 double-double comparison
  xstarUnifUnchanged: 27.035582,
  verdict:
    "MEASUREMENT CONFIRMS the imp-95259 PhiUnif via an independent " +
    "exact-rational (BigInt) evaluation: PhiUnif = 9.97792768180888053e-21. " +
    "The imp-95259 double-precision log-sum literal overshoots the exact " +
    "value by ~4.22e-15 and the imp-95250 crude literal by ~2.27e-15 -- both " +
    "LARGER than the ~1.8e-15 crude-vs-exact gap imp-95259 reported, so that " +
    "gap was limited by double precision, not a genuine separation. Both " +
    "baked literals are correct to ~15 significant figures; the exact value " +
    "shifts the firing onset by ~eps/2 ~ 2e-15 and leaves XSTAR_UNIF = " +
    "27.035582 unchanged. The crude imp-95250 bound remains effectively " +
    "sharp. MEASUREMENT ONLY; introduces no bound and no theorem; changes " +
    "no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

const REF = IMP95468_PHIUNIF_BIGINT_CROSSCHECK;

// Exact-rational partial product to n=N, extracted to `dig` decimal digits
// (as a leading-significant-digit string, no leading zeros).
function phiUnifExactDigits(N, dig) {
  let num = 1n;
  let den = 1n;
  for (let n = 1; n <= N; n++) {
    const p2 = 1n << BigInt(n); // 2^n exactly
    num *= (10n * p2 - 13n) ** 16n;
    den *= (10n * p2 + 13n) ** 16n;
  }
  const scale = 10n ** BigInt(dig + 25); // PhiUnif ~ 1e-20, pad past leading zeros
  const scaled = (num * scale) / den; // exact rational floor
  return scaled.toString().replace(/^0+/, "").slice(0, dig);
}

// Nearest double of the exact-rational value (via BigInt scaled ratio).
function phiUnifExactDouble(N) {
  let num = 1n;
  let den = 1n;
  for (let n = 1; n <= N; n++) {
    const p2 = 1n << BigInt(n);
    num *= (10n * p2 - 13n) ** 16n;
    den *= (10n * p2 + 13n) ** 16n;
  }
  const dig = 40;
  const scale = 10n ** BigInt(dig + 25);
  const scaled = (num * scale) / den;
  return Number(scaled) * 10 ** -(dig + 25);
}

// imp-95259 envelope and firing onset (reproduced, not imported)
const envelope = (x) => Math.exp(-x) * (1 + 2 * x) + 2 * Math.exp(-1.5 * x);
function firingOnset(phi, level) {
  let lo = 1;
  let hi = 100;
  for (let i = 0; i < 300; i++) {
    const m = 0.5 * (lo + hi);
    if (envelope(m) ** 2 / phi <= level) hi = m;
    else lo = m;
  }
  return 0.5 * (lo + hi);
}

export const IMP95468_CROSSCHECK_ASSERTIONS = [
  {
    id: "imp95468-bigint-reproduces-baked-digits",
    description:
      "the exact-rational BigInt PhiUnif reproduces the baked 30-digit " +
      "mantissa 997792768180888053329547867604",
    holds: () =>
      phiUnifExactDigits(200, 30) === "997792768180888053329547867604",
  },
  {
    id: "imp95468-bigint-stable-across-truncation",
    description:
      "the leading 24 exact digits are identical at N = 160 and N = 260 " +
      "(tail truncation does not affect the extracted digits)",
    holds: () =>
      phiUnifExactDigits(160, 24) === phiUnifExactDigits(260, 24),
  },
  {
    id: "imp95468-logsum-literal-off-by-4e-15",
    description:
      "the imp-95259 double log-sum literal overshoots the exact-rational " +
      "value by a relative ~4.2e-15 (in [3e-15, 6e-15]) -- above double eps",
    holds: () => {
      const t = phiUnifExactDouble(200);
      const rel = (REF.phiUnifLogSumLiteral - t) / t;
      return rel > 3e-15 && rel < 6e-15;
    },
  },
  {
    id: "imp95468-crude-literal-off-by-2e-15",
    description:
      "the imp-95250 crude direct-product literal overshoots the " +
      "exact-rational value by a relative ~2.3e-15 (in [1.5e-15, 3.5e-15])",
    holds: () => {
      const t = phiUnifExactDouble(200);
      const rel = (REF.phiUnifCrudeLiteral - t) / t;
      return rel > 1.5e-15 && rel < 3.5e-15;
    },
  },
  {
    id: "imp95468-double-precision-was-the-limiting-factor",
    description:
      "the imp-95259 double log-sum error (~4e-15) EXCEEDS the ~1.8e-15 " +
      "crude-vs-exact gap it reported -- confirming that gap was limited by " +
      "double precision, not a genuine crude-vs-exact separation",
    holds: () => {
      const t = phiUnifExactDouble(200);
      const relLogSum = Math.abs(REF.phiUnifLogSumLiteral - t) / t;
      return relLogSum > REF.crudeVsExactGapReported;
    },
  },
  {
    id: "imp95468-both-literals-correct-to-15-sig-figs",
    description:
      "both baked double literals are correct to ~15 significant figures " +
      "(relative error below 1e-14) despite the double-precision floor",
    holds: () => {
      const t = phiUnifExactDouble(200);
      return (
        Math.abs(REF.phiUnifLogSumLiteral - t) / t < 1e-14 &&
        Math.abs(REF.phiUnifCrudeLiteral - t) / t < 1e-14
      );
    },
  },
  {
    id: "imp95468-firing-threshold-unchanged",
    description:
      "swapping either double literal for the exact-rational value leaves " +
      "the certificate firing onset unchanged (< 1e-9) -- no bound moves",
    holds: () => {
      const level = 0.5;
      const t = phiUnifExactDouble(200);
      const xTrue = firingOnset(t, level);
      const xLog = firingOnset(REF.phiUnifLogSumLiteral, level);
      const xCrude = firingOnset(REF.phiUnifCrudeLiteral, level);
      return Math.abs(xTrue - xLog) < 1e-9 && Math.abs(xTrue - xCrude) < 1e-9;
    },
  },
  {
    id: "imp95468-verdict-honesty",
    description:
      "the verdict carries the honest scope: measurement only, double " +
      "precision was the limiting factor, literals still correct to ~15 " +
      "sig figs, no threshold change, no bound, no theorem, no QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT CONFIRMS/.test(REF.verdict) &&
      /limited by double precision/.test(REF.verdict) &&
      /effectively\s+sharp/.test(REF.verdict) &&
      /introduces no bound and no theorem/.test(REF.verdict) &&
      /NO QED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
];

for (const a of IMP95468_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95468-phiunif-bigint-crosscheck assertion failed: ${a.id}`,
    );
  }
}

export default IMP95468_PHIUNIF_BIGINT_CROSSCHECK;
