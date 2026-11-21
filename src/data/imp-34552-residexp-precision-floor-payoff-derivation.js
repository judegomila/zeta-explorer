/**
 * @module imp-34552-residexp-precision-floor-payoff-derivation
 *
 * imp-34552 (numerical): DERIVE how much an extended-precision recompute lowers the imp-34368
 * resid_exp(k) peak-location resolution floor dk ~ sqrt(2 eps_f / |f2|), and TABULATE the attainable
 * floor at each candidate working precision BEFORE any bignum recompute (imp-34551) spends the effort.
 *
 * BACKGROUND (all anchors from imp-34368, reused verbatim -- NOT re-measured here):
 *   imp-34368 characterized the double-precision floor three concordant ways on the inherited
 *   imp-33810/imp-33878 resid_exp(k) surrogate near the deep-ladder peak k* ~ 8.8210915878573530:
 *     - TRUE hump curvature |f2| ~ 0.036196 (central differences, stable over h = 1e-2 .. 1e-4). FIXED.
 *     - resid_exp evaluation noise eps_f ~ 9.43e-17 (~6.5 ulp of f_peak ~ 0.0653) at native f64.
 *     - smooth-maximum map dk ~ sqrt(2 eps_f / |f2|) ~ 7.2e-8, DIRECTLY confirmed by the max-min ~9e-8
 *       scatter of the ternary peak across ten brackets.
 *   imp-34368 concluded: |f2| is fixed, so the ONLY lever that lowers the floor is raising the WORKING
 *   precision of the resid_exp evaluation (bignum), because eps_f scales with the mantissa width. That
 *   scaling was never turned into a per-precision payoff table -- this module does exactly that.
 *
 * THE DERIVATION:
 *   The evaluation noise eps_f is the machine unit-roundoff of the working format times a
 *   precision-INDEPENDENT accumulation factor A (the ~6.5-ulp OLS/log rounding chain of resid_exp).
 *   With A fixed and |f2| fixed, eps_f scales purely with the significand width p (bits, implicit bit
 *   included): eps_f(p) = eps_f(53) * 2^(53 - p). Hence
 *
 *       dk(p) = sqrt(2 eps_f(p) / |f2|) = dk(53) * 2^((53 - p) / 2),
 *
 *   i.e. the floor drops by HALF a bit of k* per bit of added mantissa -- a sqrt law, not linear. Each
 *   candidate format therefore buys log10(2^((p-53)/2)) = (p-53)/2 * log10(2) extra significant figures
 *   of the peak location, and NO amount of extra precision changes |f2| or the accumulation factor A.
 *
 * TABULATED PAYOFF (significand widths p; dk and sig-figs derived, not measured):
 *   - binary64  (double,   p=53):  dk ~ 7.2e-8   (baseline, ~8.1 resolvable sig figs of k*)
 *   - x87 80-bit(extended, p=64):  dk ~ 1.6e-9   (~45x tighter; ~+1.66 sig figs -> ~9.7 total)
 *   - binary128 (quad,     p=113): dk ~ 6.7e-17  (~1.07e9x tighter; ~+9.03 sig figs -> ~17.1 total)
 *
 * KEY PAYOFF CONCLUSION (scopes imp-34551 before it spends the recompute): to RESOLVE the imp-34228
 * ~4.27e-11 live-vs-stored offset the floor must fall below it, i.e. dk(p) < 4.27e-11. Solving
 * dk(53) * 2^((53-p)/2) < 4.27e-11 gives p > ~74.4 bits. So x87 80-bit extended (p=64, dk~1.6e-9,
 * still ~37x ABOVE the offset) is NOT enough -- it cannot resolve the offset -- whereas binary128
 * (p=113, dk~6.7e-17, ~6e5x BELOW the offset) resolves it with ~6 orders of margin to spare. imp-34551
 * should therefore target a >=75-bit (ideally binary128 / double-double) working precision, not merely
 * x87 long double.
 *
 * ASSESSMENT / DERIVATION ONLY. No bignum recompute is performed; the numbers are the algebraic
 * consequence of imp-34368's measured eps_f, |f2| and the mantissa-width scaling of unit roundoff. The
 * accumulation factor A is assumed precision-independent (the same operation count at any width); a real
 * bignum run (imp-34551) is what would confirm A does not drift. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive,
 * not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643)
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34368-residexp-resolution-floor-measurement (source of eps_f, |f2|, dk, k*; reused verbatim)
 * @see imp-34551 (the bignum resid_exp recompute this table scopes the payoff for)
 * @see imp-34228 (the ~4.27e-11 live-vs-stored offset used as the resolution target)
 */

// Fixed anchors measured by imp-34368 (verbatim; NOT re-measured here).
const K_STAR = 8.8210915878573530; // deep-ladder live ternary peak (imp-34228/imp-34368)
const F2_ABS = 0.036196; // |true hump curvature| (central differences, stable over h=1e-2..1e-4)
const EPS_F_DOUBLE = 9.43e-17; // resid_exp RMS evaluation noise at native f64 (~6.5 ulp of f_peak)
const P_DOUBLE = 53; // binary64 significand width (implicit bit included)
const OFFSET_34228 = 4.27e-11; // imp-34228 live-vs-stored offset to be resolved

// The smooth-maximum floor at a given significand width p, from dk = sqrt(2 eps_f(p) / |f2|)
// with eps_f(p) = eps_f(53) * 2^(53 - p).
function epsFAtPrecision(p) {
  return EPS_F_DOUBLE * Math.pow(2, P_DOUBLE - p);
}
function floorAtPrecision(p) {
  return Math.sqrt((2 * epsFAtPrecision(p)) / F2_ABS);
}

const DK_DOUBLE = floorAtPrecision(P_DOUBLE); // ~7.22e-8, reproduces the imp-34368 baseline

// The three candidate working precisions.
const PRECISIONS = [
  { name: 'binary64 (double)', p: 53 },
  { name: 'x87 80-bit extended', p: 64 },
  { name: 'binary128 (quad)', p: 113 },
];

// dk(p), the tightening factor vs double, the extra significant figures each precision buys, the
// total resolvable sig figs of k*, and the resolvable decimal places.
const PAYOFF_TABLE = PRECISIONS.map(({ name, p }) => {
  const dk = floorAtPrecision(p);
  const tighteningVsDouble = DK_DOUBLE / dk; // >=1
  const extraSigFigs = Math.log10(tighteningVsDouble); // = (p-53)/2 * log10(2)
  const totalSigFigs = Math.log10(K_STAR / dk); // resolvable significant figures of the peak location
  const decimalPlaces = -Math.log10(dk); // resolvable digits after the decimal point
  const resolvesOffset34228 = dk < OFFSET_34228;
  return {
    name,
    significandBits: p,
    epsF: epsFAtPrecision(p),
    dk,
    tighteningVsDouble,
    extraSigFigs,
    totalSigFigs,
    decimalPlaces,
    resolvesOffset34228,
  };
});

// Smallest significand width p that pushes the floor below the imp-34228 offset:
// dk(53) * 2^((53-p)/2) < OFFSET  ->  p > 53 - 2 * log2(OFFSET / dk(53)).
const P_NEEDED_FOR_OFFSET = P_DOUBLE - 2 * Math.log2(OFFSET_34228 / DK_DOUBLE);

export const IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF = {
  id: 'imp-34552',
  title:
    'Extended-precision payoff table for the imp-34368 resid_exp peak-location floor dk ~ sqrt(2 eps_f/|f2|)',
  anchors: { K_STAR, F2_ABS, EPS_F_DOUBLE, DK_DOUBLE, OFFSET_34228 },
  scalingLaw:
    'eps_f(p) = eps_f(53) * 2^(53-p); dk(p) = dk(53) * 2^((53-p)/2). Half a bit of k* resolution per ' +
    'bit of added mantissa. |f2| and the ~6.5-ulp accumulation factor A are precision-independent, so ' +
    'raising the WORKING precision is the only lever (confirming the imp-34368 conclusion quantitatively).',
  payoffTable: PAYOFF_TABLE,
  precisionNeededToResolveOffset34228: P_NEEDED_FOR_OFFSET, // ~74.4 bits: 80-bit NOT enough, 128-bit is
  isRigorous: false,
  verdict:
    'DERIVATION (NOT rigorous). Tabulates the imp-34368 resid_exp peak-location floor dk = sqrt(2 eps_f/' +
    '|f2|) as a function of significand width p, using the fixed anchors eps_f~9.43e-17 and |f2|~0.036196 ' +
    'and the mantissa-width scaling eps_f(p)=eps_f(53)*2^(53-p): dk(p)=dk(53)*2^((53-p)/2) (half a bit of ' +
    'k* per added mantissa bit, a sqrt law). ATTAINABLE FLOORS: binary64 dk~7.2e-8 (~8.1 sig figs of k*); ' +
    'x87 80-bit dk~1.6e-9 (~45x tighter, ~+1.66 sig figs); binary128 dk~6.7e-17 (~1.07e9x tighter, ~+9.03 ' +
    'sig figs, ~17.1 total). PAYOFF: resolving the imp-34228 ~4.27e-11 offset needs dk<4.27e-11, i.e. ' +
    'p>~74.4 bits -- so x87 80-bit extended (p=64) is NOT enough (still ~37x above the offset) whereas ' +
    'binary128 (p=113) clears it with ~6 orders of margin; imp-34551 should target >=75-bit precision. ' +
    'No bignum recompute is performed and the accumulation factor A is assumed precision-independent (a ' +
    'real bignum run is what would confirm A does not drift). The component model is the inherited imp-' +
    '3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the surrogate resid_exp(k) is descriptive, ' +
    'not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-' +
    '2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34368 (source of eps_f, |f2|, dk, k*; reused verbatim); imp-34551 (the bignum recompute this ' +
    'table scopes); imp-34228 (the ~4.27e-11 offset used as the resolution target); imp-486 (C_mb GUE-' +
    'conditional); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF_ASSERTIONS = [
  {
    // Baseline reproduces the imp-34368 measured double-precision floor ~7.2e-8.
    id: 'imp34552-double-baseline-reproduces-imp34368-floor',
    description: 'derived dk at p=53 reproduces the imp-34368 baseline ~7.2e-8',
    holds: () => DK_DOUBLE > 6e-8 && DK_DOUBLE < 8e-8,
  },
  {
    // The floor is strictly monotone-decreasing in the significand width (more bits -> tighter).
    id: 'imp34552-floor-monotone-in-precision',
    description: 'dk strictly decreases with significand width across double < 80-bit < binary128',
    holds: () =>
      PAYOFF_TABLE[0].dk > PAYOFF_TABLE[1].dk &&
      PAYOFF_TABLE[1].dk > PAYOFF_TABLE[2].dk,
  },
  {
    // sqrt scaling: each added bit lowers dk by exactly a factor 2^(1/2); check the extra-sig-fig law
    // extraSigFigs = (p-53)/2 * log10(2) at 80-bit (~1.66) and binary128 (~9.03).
    id: 'imp34552-sqrt-scaling-extra-sigfigs',
    description: 'extra sig figs match (p-53)/2*log10(2): ~1.66 at 80-bit, ~9.03 at binary128',
    holds: () =>
      Math.abs(PAYOFF_TABLE[1].extraSigFigs - ((64 - 53) / 2) * Math.log10(2)) < 1e-9 &&
      Math.abs(PAYOFF_TABLE[2].extraSigFigs - ((113 - 53) / 2) * Math.log10(2)) < 1e-9 &&
      PAYOFF_TABLE[1].extraSigFigs > 1.6 &&
      PAYOFF_TABLE[1].extraSigFigs < 1.7 &&
      PAYOFF_TABLE[2].extraSigFigs > 9.0 &&
      PAYOFF_TABLE[2].extraSigFigs < 9.1,
  },
  {
    // Attainable floors land in the expected decades: 80-bit ~1.6e-9, binary128 ~6.7e-17.
    id: 'imp34552-attainable-floors-in-expected-decades',
    description: 'x87 80-bit dk~1.6e-9 and binary128 dk~6.7e-17',
    holds: () =>
      PAYOFF_TABLE[1].dk > 1e-9 &&
      PAYOFF_TABLE[1].dk < 3e-9 &&
      PAYOFF_TABLE[2].dk > 3e-17 &&
      PAYOFF_TABLE[2].dk < 1e-16,
  },
  {
    // The decisive payoff: 80-bit does NOT resolve the imp-34228 offset, binary128 DOES, and the
    // crossover precision is ~74.4 bits (between the two).
    id: 'imp34552-offset-resolution-precision-threshold',
    description: '80-bit cannot resolve the ~4.27e-11 offset, binary128 can; threshold ~74.4 bits',
    holds: () =>
      PAYOFF_TABLE[1].resolvesOffset34228 === false &&
      PAYOFF_TABLE[2].resolvesOffset34228 === true &&
      P_NEEDED_FOR_OFFSET > 64 &&
      P_NEEDED_FOR_OFFSET < 113 &&
      Math.abs(P_NEEDED_FOR_OFFSET - 74.4) < 1.0,
  },
  {
    // Honesty gate: derivation only, isRigorous false, no QED, no refereed bound is changed, inherited constants untouched.
    id: 'imp34552-honesty-gate-no-qed',
    description: 'Derivation only: isRigorous false, no QED, no refereed bound is changed, imp-3066 and inherited constants untouched',
    holds: () =>
      IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF.isRigorous === false &&
      /NOT rigorous/.test(IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF.verdict) &&
      /NO QED/.test(IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF.verdict) &&
      /refereed bound is changed/i.test(IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF.verdict) &&
      /C_C 1\/8 ansatz \(imp-2642\/imp-2643\) is UNTOUCHED/i.test(IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF.verdict),
  },
];

for (const a of IMP34552_RESIDEXP_PRECISION_FLOOR_PAYOFF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34552-residexp-precision-floor-payoff-derivation assertion failed: ${a.id}`);
  }
}
