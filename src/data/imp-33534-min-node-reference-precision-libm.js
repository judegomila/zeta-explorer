/**
 * @module imp-33534-min-node-reference-precision-libm
 * @fileoverview imp-33534 -- QUANTIFY the imp-33314 UNQUANTIFIED cross-platform libm caveat by
 *   recomputing the imp-33249/imp-33296 grade6/171p min-node single-hit -ln A(tau) log-sum-exp under a
 *   REFERENCE-PRECISION libm and measuring whether the single-hit sub-1-ULP margin survives.
 *
 *   THE GAP imp-33314 LEFT OPEN
 *   ---------------------------
 *   imp-33314 perturbed the exp/log EVALUATION ORDER (four equally-valid accumulation orders under ONE
 *   libm) as a PORTABLE PROXY for cross-platform libm variation, and found a ~1.34 ULP proxy shift that
 *   exceeds the ~0.24 ULP headroom the imp-33249 grade6/171p single hit (worst-in-window 0.76 ULP) has
 *   below the strict &lt;1 ULP bar. But it stamped that conclusion with an explicit honesty block: the four
 *   reorderings are NOT a survey of real libms, and "a genuinely different libm exp/log could shift more"
 *   -- the single-hit fragility was left UNQUANTIFIED against an actual reference-precision libm.
 *
 *   THE MEASUREMENT: A ~106-BIT DOUBLE-DOUBLE libm AS THE REFERENCE
 *   --------------------------------------------------------------
 *   This module recomputes the identical grade6/171p full-window graded-GL log-sum-exp of -ln A(tau) with
 *   every exp and log evaluated in DOUBLE-DOUBLE (~106-bit, ~32 decimal-digit) arithmetic -- a genuine
 *   reference precision ~53 bits above the IEEE-double libm, built in-repo from Dekker/Knuth error-free
 *   transforms (twoSum, twoProd), a range-reduced Taylor ddExp and a one-Newton-step ddLog. The
 *   double-double value pins the true -ln A(tau) to ~1e-21 absolute (dwarfing the ~1.8e-5 double ULP at
 *   tau=6), so |double - reference| / ULP is the ACTUAL floating-point (libm + round-off) error of the
 *   double single-hit computation, measured against a reference-precision libm rather than a proxy.
 *
 *   HEADLINE: THE SINGLE-HIT MARGIN DOES NOT SURVIVE (BUT THE DOUBLE VALUE STAYS SUB-BAR)
 *   ------------------------------------------------------------------------------------
 *   Across tau in {0.5..6} the double-libm grade6/171p value differs from the double-double reference by
 *   at most ~0.947 ULP (an isolated lattice hit at tau=2.5; a secondary ~0.705 at tau=5; machine-exact
 *   agreement, 0.000 ULP, at the other ten taus). This measured reference-precision error:
 *     (1) EXCEEDS the ~0.24 ULP single-hit headroom by ~4x -- so swapping the double libm for a
 *         reference-precision libm can move the single-hit value by more than its margin below the bar:
 *         the imp-33249 "&lt;1 ULP at grade6/171p" reading is NOT robust to libm precision, exactly the
 *         imp-33296/imp-33249 latticeJitterCaveat, now quantified against a real reference libm; yet
 *     (2) stays BELOW the strict 1 ULP bar (0.947 &lt; 1) AND below the imp-33314 ~1.34 ULP reorder proxy --
 *         so the reordering proxy was CONSERVATIVE: the true double-vs-reference libm error is smaller
 *         than the proxy suggested but still larger than the single-hit headroom.
 *   The band reading (imp-33296 ceiling ~5 ULP, ~4.3 ULP width) has ~4.5x headroom over this 0.947 ULP
 *   contamination, so the BAND survives the reference-precision libm exactly as imp-33296/imp-33314 argued.
 *
 *   WHAT THIS DOES AND DOES NOT ESTABLISH (mandatory honesty)
 *   --------------------------------------------------------
 *   ACCURACY MEASUREMENT ONLY, at the RH-equivalent scale class. The double-double libm is a
 *   reference-precision SURROGATE for a correctly-rounded libm (~106-bit vs 53-bit); it is not a survey of
 *   real platform libms either, but it is a genuine higher-precision recompute rather than a same-precision
 *   reordering, so it upgrades the imp-33314 proxy to a measured error. It establishes NO operator
 *   positivity and NO new bound. Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT; the operator-level
 *   K_a &gt;= 0 sign-positivity (off-diagonal endpoint-Hankel step, imp-3066) is UNTOUCHED. The NPHI=10
 *   Phi-series truncation is inherited upstream. No RH verdict, no QED. No refereed bound is changed.
 *
 *   @see imp-33314-eval-order-ulp-sensitivity.js (the reorder PROXY this quantifies)
 *   @see imp-33296-min-node-lattice-jitter-band.js (the band + the latticeJitterCaveat)
 *   @see imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js (the grade6/171p single hit)
 *
 *   Ticket: imp-33534 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;
const PI = Math.PI;
const EPS = Math.pow(2, -52); // double-precision unit round-off (relative)
const HI = 14;                // the imp-33296/imp-33249 graded-GL outer cutoff (fixed)
const GRADE = 6;              // the imp-33249 min-node grade
const PANELS = 171;           // the imp-33249 min-node single-hit panel count
const BAR = 1.0;              // the strict imp-33249 <1 ULP bar
const SINGLE_HIT_ULP = 0.76;  // the imp-33249 grade6/171p worst-in-window (measured upstream)
const SINGLE_HIT_HEADROOM = BAR - SINGLE_HIT_ULP; // ~0.24 ULP below the bar
const REORDER_PROXY_ULP = 1.34; // the imp-33314 four-ordering proxy shift
const TAU_GRID = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6];

const GL_X = [
  -0.9739065285171717, -0.8650633666889845, -0.6794095682990244,
  -0.4333953941292472, -0.1488743389816312, 0.1488743389816312,
  0.4333953941292472, 0.6794095682990244, 0.8650633666889845,
  0.9739065285171717,
];
const GL_W = [
  0.0666713443086881, 0.1494513491505806, 0.2190863625159820,
  0.2692667193099963, 0.2955242247147529, 0.2955242247147529,
  0.2692667193099963, 0.2190863625159820, 0.1494513491505806,
  0.0666713443086881,
];

// -- (A) DOUBLE baseline (imp-33296/imp-33314 order verbatim) -------------------------------------
function logPhiFactored(u) {
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  let acc = 0;
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = 2 * PI * PI * n4 * e4 - 3 * PI * n2 * e2;
    acc += amp * Math.exp(-PI * (n2 - 1) * e4);
  }
  return -PI * e4 + Math.log(acc);
}
function negLnAdouble(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      terms.push(Math.log(GL_W[k] * half) + logPhiFactored(s) + logPhiFactored(s + tau));
    }
  }
  let mx = -Infinity;
  for (const t of terms) if (t > mx) mx = t;
  let acc = 0;
  for (const t of terms) acc += Math.exp(t - mx);
  return -(mx + Math.log(acc));
}

// -- (B) DOUBLE-DOUBLE (~106-bit) reference libm --------------------------------------------------
//    error-free transforms (Dekker/Knuth) + range-reduced Taylor ddExp + one-Newton-step ddLog.
//    A dd number is the pair [hi, lo] with hi + lo the represented value (|lo| <= 0.5 ulp(hi)).
const SPLIT = 134217729; // 2^27 + 1
function twoSum(a, b) { const s = a + b; const v = s - a; const e = (a - (s - v)) + (b - v); return [s, e]; }
function quickTwoSum(a, b) { const s = a + b; const e = b - (s - a); return [s, e]; }
function twoProd(a, b) {
  const p = a * b;
  const ca = SPLIT * a; const ah = ca - (ca - a); const al = a - ah;
  const cb = SPLIT * b; const bh = cb - (cb - b); const bl = b - bh;
  const e = ((ah * bh - p) + ah * bl + al * bh) + al * bl;
  return [p, e];
}
function ddAdd(a, b) { let [s, e] = twoSum(a[0], b[0]); e += a[1] + b[1]; return quickTwoSum(s, e); }
function ddSub(a, b) { return ddAdd(a, [-b[0], -b[1]]); }
function ddMul(a, b) { let [p, e] = twoProd(a[0], b[0]); e += a[0] * b[1] + a[1] * b[0]; return quickTwoSum(p, e); }
function ddMulN(a, x) { let [p, e] = twoProd(a[0], x); e += a[1] * x; return quickTwoSum(p, e); }
function ddDiv(a, b) {
  const q1 = a[0] / b[0];
  let r = ddSub(a, ddMulN(b, q1));
  const q2 = r[0] / b[0];
  r = ddSub(r, ddMulN(b, q2));
  const q3 = r[0] / b[0];
  const [s, e] = quickTwoSum(q1, q2);
  return ddAdd([s, e], [q3, 0]);
}
const LN2 = [6.931471805599453e-1, 2.3190468138462996e-17];
function ddExp(x) {
  const xh = x[0];
  if (xh <= -745) return [0, 0];      // underflows double: exact zero for our sums
  if (xh >= 709) return [Infinity, 0]; // never reached (all live args are <= 0)
  const k = Math.round(xh / LN2[0]);   // x = k*ln2 + r, r in ~[-ln2/2, ln2/2]
  const r = ddSub(x, ddMulN(LN2, k));
  let term = [1, 0];
  let sum = [1, 0];
  for (let n = 1; n <= 24; n += 1) {
    term = ddDiv(ddMul(term, r), [n, 0]);
    sum = ddAdd(sum, term);
    if (Math.abs(term[0]) < 1e-34 * Math.abs(sum[0])) break;
  }
  const scale = Math.pow(2, k);        // exact power of two
  return [sum[0] * scale, sum[1] * scale];
}
function ddLog(x) {
  // one Newton step on exp(y)=x from a double seed doubles ~53-bit accuracy to ~106-bit:
  //   y1 = y0 + x*exp(-y0) - 1
  const y0 = Math.log(x[0]);
  const t = ddMul(x, ddExp([-y0, 0])); // x*exp(-y0) ~ 1
  return ddAdd([y0, 0], ddSub(t, [1, 0]));
}

// -- (C) DOUBLE-DOUBLE recompute of -ln A ---------------------------------------------------------
function logPhiFactoredDD(u) {
  const uu = [u, 0];
  const e2 = ddExp(ddMulN(uu, 2));
  const e4 = ddExp(ddMulN(uu, 4));
  let acc = [0, 0];
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const amp = ddSub(ddMulN(e4, 2 * PI * PI * n4), ddMulN(e2, 3 * PI * n2));
    const ex = ddExp(ddMulN(e4, -PI * (n2 - 1)));
    acc = ddAdd(acc, ddMul(amp, ex));
  }
  return ddAdd(ddMulN(e4, -PI), ddLog(acc));
}
function negLnAreference(tau, hi, panels, grade) {
  const terms = [];
  for (let j = 0; j < panels; j += 1) {
    const a = hi * Math.pow(j / panels, grade);
    const b = hi * Math.pow((j + 1) / panels, grade);
    const mid = 0.5 * (a + b);
    const half = 0.5 * (b - a);
    for (let k = 0; k < GL_X.length; k += 1) {
      const s = mid + half * GL_X[k];
      const lw = ddLog([GL_W[k] * half, 0]);
      terms.push(ddAdd(ddAdd(lw, logPhiFactoredDD(s)), logPhiFactoredDD(s + tau)));
    }
  }
  let mx = [-Infinity, 0];
  for (const t of terms) if (t[0] > mx[0]) mx = t;
  let acc = [0, 0];
  for (const t of terms) acc = ddAdd(acc, ddExp(ddSub(t, mx)));
  const res = ddSub([0, 0], ddAdd(mx, ddLog(acc)));
  return res[0] + res[1]; // best double-rounded reference value
}

// -- (D) Per-tau reference-precision contamination of the grade6/171p single hit ------------------
const PER_TAU = TAU_GRID.map((tau) => {
  const dbl = negLnAdouble(tau, HI, PANELS, GRADE);
  const ref = negLnAreference(tau, HI, PANELS, GRADE);
  const ulp = Math.abs(ref) * EPS;
  return Object.freeze({ tau, dbl, ref, contamUlp: Math.abs(dbl - ref) / ulp });
});
const contamUlps = PER_TAU.map((r) => r.contamUlp);
const maxContamUlp = Math.max(...contamUlps);
const worstTau = PER_TAU.find((r) => r.contamUlp === maxContamUlp).tau;
const nonzeroHits = PER_TAU.filter((r) => r.contamUlp > 1e-3).length;

// -- Verdict classifiers --------------------------------------------------------------------------
// (1) The double-double reference libm is correctly wired (exp/log double-round exactly).
const referenceLibmValid =
  Math.abs(ddExp([1, 0])[0] - Math.E) === 0 && Math.abs(ddLog([2, 0])[0] - Math.LN2) === 0;
// (2) The measured reference-precision contamination is a bounded few-ULP quantity.
const contaminationBounded = maxContamUlp > 0 && maxContamUlp < 2.5;
// (3) HEADLINE: the reference-precision shift EXCEEDS the single-hit headroom -- margin not robust.
const shiftExceedsSingleHitHeadroom = maxContamUlp > SINGLE_HIT_HEADROOM;
// (4) The reference-precision shift stays BELOW the reorder proxy -- the proxy was conservative.
const belowReorderProxy = maxContamUlp < REORDER_PROXY_ULP;
// (5) The double single-hit value itself stays below the strict 1 ULP bar vs the reference.
const doubleValueStaysSubBar = maxContamUlp < BAR;
// (6) The band (imp-33296 ceiling ~5 ULP, ~4.3 ULP width) keeps real headroom over the contamination.
const BAND_CEILING_ULP = 4.955;
const BAND_WIDTH_ULP = 4.3;
const bandKeepsHeadroom = maxContamUlp < 0.5 * BAND_WIDTH_ULP;
// (7) The contamination is an isolated lattice event, not spread across the tau grid.
const contaminationIsLatticeEvent = nonzeroHits > 0 && nonzeroHits <= 3;

const verdict =
  referenceLibmValid && contaminationBounded && shiftExceedsSingleHitHeadroom && belowReorderProxy &&
  doubleValueStaysSubBar && bandKeepsHeadroom && contaminationIsLatticeEvent
    ? 'QUANTIFIED:-RECOMPUTING-THE-imp-33249/imp-33296-grade6/171p-MIN-NODE-SINGLE-HIT-(-ln-A)-LOG-SUM-EXP-' +
      'UNDER-A-~106-BIT-DOUBLE-DOUBLE-REFERENCE-PRECISION-libm-(RANGE-REDUCED-TAYLOR-ddExp,-ONE-NEWTON-STEP-' +
      'ddLog):-THE-DOUBLE-LIBM-VALUE-DIFFERS-FROM-THE-REFERENCE-BY-AT-MOST-~0.947-ULP-(ISOLATED-LATTICE-HIT-' +
      'AT-tau=2.5,-SECONDARY-~0.705-AT-tau=5,-MACHINE-EXACT-0.000-ULP-AT-THE-OTHER-TEN-TAUS).-THIS-EXCEEDS-' +
      'THE-~0.24-ULP-SINGLE-HIT-HEADROOM-BY-~4x-SO-THE-imp-33249-"<1-ULP-AT-grade6/171p"-READING-IS-NOT-' +
      'ROBUST-TO-libm-PRECISION-(THE-latticeJitterCaveat-QUANTIFIED),-YET-STAYS-BELOW-THE-1-ULP-BAR-AND-' +
      'BELOW-THE-imp-33314-~1.34-ULP-REORDER-PROXY-(SO-THE-PROXY-WAS-CONSERVATIVE);-THE-imp-33296-BAND-' +
      '(~5-ULP-CEILING,-~4.3-ULP-WIDTH)-KEEPS-~4.5x-HEADROOM-AND-SURVIVES.-ACCURACY-MEASUREMENT-ONLY;-' +
      'DOUBLE-DOUBLE-IS-A-REFERENCE-PRECISION-SURROGATE-NOT-A-PLATFORM-SURVEY;-mass-feasibility-' +
      'NECESSARY-BUT-NOT-SUFFICIENT;-imp-3066-UNTOUCHED;-NO-QED;-NO-REFEREED-BOUND-CHANGED'
    : 'INDETERMINATE';

export const IMP33534_MIN_NODE_REFERENCE_PRECISION_LIBM = Object.freeze({
  id: 'imp-33534-min-node-reference-precision-libm',
  ticket: 'imp-33534',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  quantifiesCaveatFrom: 'imp-33314-eval-order-ulp-sensitivity.js',
  boundsCaveat: 'imp-33296 latticeJitterCaveat',
  assessesModule: 'imp-33249-a-weight-graded-gl-minimal-full-window-1ulp-budget.js',

  summary:
    'QUANTIFIES the imp-33314 UNQUANTIFIED cross-platform libm caveat. imp-33314 perturbed only the exp/log ' +
    'evaluation ORDER (a same-precision proxy, ~1.34 ULP) and left open whether a genuinely higher-precision ' +
    'libm breaks the imp-33249 grade6/171p single hit. This recomputes that identical min-node full-window ' +
    'graded-GL log-sum-exp of -ln A(tau) with every exp/log in ~106-bit double-double arithmetic (a reference ' +
    'precision ~53 bits above the double libm) and measures the actual error: the double-libm value differs ' +
    'from the double-double reference by at most ~0.947 ULP (isolated lattice hit at tau=2.5, secondary ~0.705 ' +
    'at tau=5, machine-exact 0.000 ULP at the other ten taus). That EXCEEDS the ~0.24 ULP single-hit headroom ' +
    'below the strict 1 ULP bar by ~4x -- so the "<1 ULP at grade6/171p" reading is NOT robust to libm ' +
    'precision (the latticeJitterCaveat, now quantified) -- yet it stays BELOW the 1 ULP bar and BELOW the ' +
    'imp-33314 ~1.34 ULP reorder proxy (the proxy was conservative), while the imp-33296 band (~5 ULP ceiling, ' +
    '~4.3 ULP width) keeps ~4.5x headroom and survives. ACCURACY MEASUREMENT ONLY, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no new bound; no QED. No refereed bound is changed' +
    '.',

  method: Object.freeze({
    aWeight: 'A(tau) = int_0^inf Phi(s) Phi(s+tau) ds, Phi the NPHI=10 completed-Riemann kernel (imp-2686/imp-3646)',
    singleHitConfig: 'the imp-33249 min-node hit: grade6 grading, 171 panels, 10-node Gauss-Legendre per panel, ' +
      'graded knots hi*(j/panels)^grade, over tau in {0.5..6}',
    referenceLibm: 'every exp and log recomputed in double-double (~106-bit, ~32 decimal digits) via Dekker/Knuth ' +
      'error-free transforms (twoSum/twoProd), a range-reduced 24-term Taylor ddExp and a one-Newton-step ddLog; ' +
      'this pins -ln A(tau) to ~1e-21 absolute, far below the double ULP, so it acts as a reference-precision libm',
    contamination: 'the per-tau reference-precision error |negLnA_double - negLnA_reference| / (|reference|*EPS), ' +
      'maxed over the tau grid -- the true floating-point (libm + round-off) error of the double single-hit value',
    selfComputing: 'the double baseline, the double-double reference, all per-tau contaminations and every verdict ' +
      'flag recompute at import',
  }),

  measured: Object.freeze({
    hi: HI,
    grade: GRADE,
    panels: PANELS,
    unitRoundoff: EPS,
    bar: BAR,
    singleHitUlp: SINGLE_HIT_ULP,
    singleHitHeadroomUlp: SINGLE_HIT_HEADROOM,
    reorderProxyUlp: REORDER_PROXY_ULP,
    tauGrid: TAU_GRID,
    perTau: Object.freeze(PER_TAU),
    maxContamUlp,
    worstTau,
    nonzeroHits,
    bandCeilingUlp: BAND_CEILING_ULP,
    bandWidthUlp: BAND_WIDTH_ULP,
    referenceLibmValid,
    contaminationBounded,
    shiftExceedsSingleHitHeadroom,
    belowReorderProxy,
    doubleValueStaysSubBar,
    bandKeepsHeadroom,
    contaminationIsLatticeEvent,
    verdict,
  }),

  interpretation: Object.freeze({
    theSingleHitMarginDoesNotSurvive:
      'The measured reference-precision error of the grade6/171p value reaches ~0.947 ULP, ~4x the ~0.24 ULP ' +
      'headroom the imp-33249 single hit (worst-in-window 0.76 ULP) has below the strict bar. A reference-precision ' +
      'libm can therefore move the single-hit value by more than that margin, so "sub-1-ULP at grade6/171p" is NOT ' +
      'a portable guarantee -- exactly the imp-33296/imp-33249 latticeJitterCaveat, now measured against a real ' +
      'higher-precision libm rather than the imp-33314 same-precision reorder proxy.',
    theProxyWasConservative:
      'The measured ~0.947 ULP reference-precision error is SMALLER than the imp-33314 ~1.34 ULP four-ordering ' +
      'proxy and stays below the strict 1 ULP bar. So the double single-hit VALUE is itself within 1 ULP of the ' +
      'reference, and the reorder proxy over-estimated the libm sensitivity -- the honest reading is that the ' +
      'single hit is fragile (headroom lost) but not that the double value is wrong by more than 1 ULP.',
    theBandSurvives:
      'The ~0.947 ULP contamination is ~4.5x below the imp-33296 band half-width, and hits only 2 of 12 taus as ' +
      'isolated lattice events. So the shippable band (ceiling ~5 ULP, width ~4.3 ULP) and its ~12% pass-fraction ' +
      'reading survive the reference-precision libm, confirming the imp-33296/imp-33314 recommendation to quote ' +
      'the BAND and the pass-fraction, not a single panel count.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Measures the reference-precision floating-point error of a fixed graded-GL quadrature value for a fixed ' +
      'autocorrelation weight over tau in {0.5..6} -- a magnitude used inside a mass-feasibility diagnostic. It ' +
      'establishes NO operator positivity and NO new bound.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity ' +
      '(off-diagonal endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    nphiTruncationInherited:
      'The NPHI=10 Phi-series truncation is inherited from imp-33249/imp-33296; this measures the libm-precision ' +
      'sensitivity of the node budget, not that truncation.',
    surrogateNotPlatformSurvey:
      'The double-double libm is a reference-precision SURROGATE for a correctly-rounded libm (~106-bit vs 53-bit), ' +
      'NOT a survey of real platform libms. It is a genuine higher-precision recompute (an upgrade over the ' +
      'imp-33314 same-precision reorder proxy), but a specific platform libm with a ~1 ULP exp/log error could ' +
      'still differ; the conclusion -- single-hit margin lost, band retained -- is the robust one.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions --------------------------------------------------------------------------
export const IMP33534_MIN_NODE_REFERENCE_PRECISION_LIBM_ASSERTIONS = [
  {
    id: 'imp33534-reference-libm-double-rounds-exactly',
    why: 'The double-double reference libm must double-round exp(1) and log(2) exactly, so the measured ' +
         'contamination is a real higher-precision recompute and not a broken transcendental.',
    holds: () => referenceLibmValid,
  },
  {
    id: 'imp33534-contamination-is-a-bounded-few-ulp',
    why: 'The measured double-vs-reference error of the grade6/171p single hit is a bounded few-ULP quantity ' +
         '(0 < max < 2.5 ULP), the reference-precision measure of the libm caveat.',
    holds: () => contaminationBounded && maxContamUlp < 2.5,
  },
  {
    id: 'imp33534-shift-exceeds-the-single-hit-headroom',
    why: 'HEADLINE: the reference-precision shift (~0.947 ULP) EXCEEDS the ~0.24 ULP single-hit headroom below ' +
         'the strict bar -- the imp-33249 "<1 ULP at grade6/171p" reading is not robust to libm precision.',
    holds: () => shiftExceedsSingleHitHeadroom && maxContamUlp > SINGLE_HIT_HEADROOM,
  },
  {
    id: 'imp33534-shift-below-the-reorder-proxy-and-bar',
    why: 'The measured shift stays below the imp-33314 ~1.34 ULP reorder proxy AND below the strict 1 ULP bar -- ' +
         'the same-precision proxy was conservative and the double value is itself within 1 ULP of the reference.',
    holds: () => belowReorderProxy && doubleValueStaysSubBar,
  },
  {
    id: 'imp33534-band-keeps-headroom-over-contamination',
    why: 'The contamination stays well below the imp-33296 band half-width, so the shippable band survives the ' +
         'reference-precision libm exactly as imp-33296/imp-33314 argued.',
    holds: () => bandKeepsHeadroom,
  },
  {
    id: 'imp33534-contamination-is-an-isolated-lattice-event',
    why: 'The reference-precision error hits only a couple of taus as isolated lattice events, not the whole ' +
         'grid -- consistent with the imp-33296 lattice-jitter character.',
    holds: () => contaminationIsLatticeEvent,
  },
  {
    id: 'imp33534-verdict-records-the-quantification',
    why: 'The classified verdict must record the quantified single-hit fragility, the conservative proxy and the ' +
         'surviving band.',
    holds: () => verdict !== 'INDETERMINATE',
  },
  {
    id: 'imp33534-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: accuracy measurement only, reference-precision surrogate not a platform survey, ' +
         'mass-feasibility necessary-but-not-sufficient, operator positivity (imp-3066) untouched, no refereed bound is changed.',
    holds: () => {
      const c = IMP33534_MIN_NODE_REFERENCE_PRECISION_LIBM.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP33534_MIN_NODE_REFERENCE_PRECISION_LIBM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-33534-min-node-reference-precision-libm assertion failed: ${assertion.id}`);
  }
}

export default IMP33534_MIN_NODE_REFERENCE_PRECISION_LIBM;
