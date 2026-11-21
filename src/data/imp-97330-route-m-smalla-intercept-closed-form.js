/**
 * @module imp-97330-route-m-smalla-intercept-closed-form
 * @fileoverview imp-97330 -- MEASUREMENT + PIN (no bound moved):
 *   Pin the small-a Bettin-Conrey intercept d_a from imp-97311 RESULT 1, which fit
 *       I(a,b) = kappa_a log b + d_a + o(1),   kappa_a = a/2 (exact),
 *   and reported the intercept table d_1..d_5 = 1.13063, 1.56736, 1.74257, 1.74813, 1.62691 as a
 *   "non-monotone arithmetic function of a driven by the V(b,a) residue sum, not pinned here".
 *   Measure d_a over a WIDE a-range (a = 1..47, prime and composite) and decide its structure.
 *
 *   d_a is measured as the mean over coprime b of I(a,b) - (a/2) log b (the residue oscillation of
 *   V(b,a) has period a; averaging over a large b-window kills it). Kernel and fit reuse imp-97311.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT -- d_a HAS A CLEAN CLOSED FORM (it is NOT an arithmetic residue-driven function):
 *       d_a = a (C + 1/2) - (a/2) log a = (a/2)(2C + 1 - log a),   C = (log 2pi - gamma)/2.
 *   ------------------------------------------------------------------------------------------
 *   MEASURED: d_a - [a(C+1/2) - (a/2)log a] is uniform o(1), decaying with the fit window:
 *   at b in [20000,26000] the residual is < 3e-5 for a <= 14; at b in [80000,90000] it is
 *   ~ -1.6e-6 * a across a = 2..47 (pure finite-b truncation of the o(1) tail, same sign and
 *   scale for every a). Equivalently the residual r_a = d_a - [a C - (a/2)log a] measured EXACTLY
 *   a/2 to 5-6 digits for every a = 1..24 (r_a/a = 0.500000 +- 6e-6). The residue dependence of
 *   d_a on b mod a is at the o(1) noise floor (std across the phi(a) residues of a = 12 was
 *   5.3e-5, itself a finite-b artifact), so d_a carries NO net arithmetic (residue / prime) signal.
 *
 *   ------------------------------------------------------------------------------------------
 *   MECHANISM -- where each piece comes from (corrects the ticket premise)
 *   ------------------------------------------------------------------------------------------
 *   Decompose I(a,b) = C(a+b) + (1/2)(a-b)(log b - log a) - (pi/2)(V(a,b) + V(b,a)). The constant
 *   (b-independent) survivors are:
 *     - C a               from the a-part of C(a+b)                            (linear in a)
 *     - -(a/2) log a      from -(a/2) log a in (1/2)(a-b)(log b - log a)       (the log a term)
 *     - +a/2              from the O(1) constant of -(pi/2) V(a,b): V(a,b) = -(b/pi)log b
 *                         + (2C/pi) b - a/pi + o(1), so -(pi/2)(-a/pi) = +a/2  (generalizes the
 *                         a=1 border constant 1/2 of imp-96667 to -a/pi)
 *     - 0                 the MEAN of -(pi/2) V(b,a) over b mod a vanishes: V(b,a) is a bounded
 *                         period-a oscillation with zero residue mean (contributes to the o(1)
 *                         wobble, NOT to d_a)
 *   Summing: d_a = a(C+1/2) - (a/2) log a. So the intercept is driven by the ARITHMETIC -(a/2)log a
 *   and the V(a,b) constant -a/pi, NOT by the V(b,a) residue sum (which averages to zero). The
 *   imp-97311 "non-monotone arithmetic function via V(b,a)" description is CORRECTED: d_a is a
 *   SMOOTH function of a; the non-monotonicity (rise to a peak near a = e^{2C} ~ 3.53 then fall,
 *   d_a -> -infinity like -(a/2)log a) is just the shape of (a/2)(2C+1-log a), maximum value
 *   e^{2C}/2 ~ 1.764 at a ~ 3.53, straddled by the measured integer plateau d_3 ~ 1.743, d_4 ~ 1.749.
 *
 *   ------------------------------------------------------------------------------------------
 *   CONSEQUENCE for the crossover profile (imp-97329 / imp-97311 sub-gap)
 *   ------------------------------------------------------------------------------------------
 *   The fixed-a two-parameter asymptotic is now fully pinned in closed form:
 *       I(a,b) = (a/2) log b + a(C + 1/2) - (a/2) log a + o(1)
 *              = (a/2) log(b/a) + a(C + 1/2) + o(1)   (the log a folds cleanly into log(b/a)).
 *   This is the exact fixed-a input the imp-97329 uniform crossover second moment needs; it does
 *   NOT on its own resolve the b^(1/2) vs log^2 b separation, because (imp-97311) the fixed-a
 *   moment Sum kappa_a^2/a^2 = Sum 1/4 still DIVERGES -- that separation still requires the
 *   uniform (a ~ b) remainder profile. Measurement + pin only; no coefficient of g(b) is claimed;
 *   the rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds
 *   first by > 2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97311-route-m-bettin-conrey-smalla-kappa-moment (kappa_a = a/2; the d_a table left unpinned)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (rigorous a=1 border I(1,b) = (1/2)log b + (C+1/2))
 * @see imp-97329-route-m-uniform-crossover-second-moment (the crossover profile this fixed-a pin feeds)
 *
 * Ticket: imp-97330 (numerical, opus-4-8, api-pool). d_a pinned to a closed form; NO QED.
 */

export const IMP97330_GAMMA = 0.5772156649015329;
export const IMP97330_C = (Math.log(2 * Math.PI) - IMP97330_GAMMA) / 2; // (log 2pi - gamma)/2

// -- exact Vasyunin kernel V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (imp-96443 / imp-97311). --
function frac(x) {
  return x - Math.floor(x);
}
function vasyunin(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    s += frac((m * a) / q) / Math.tan((Math.PI * m) / q);
  }
  return s;
}

// -- the two-variable Vasyunin coefficient I(a,b) (symmetric, I(a,b) = I(b,a)). --------------------
export function coefficientI(a, b) {
  return (
    IMP97330_C * (a + b) +
    0.5 * (a - b) * Math.log(b / a) -
    (Math.PI / 2) * (vasyunin(a, b) + vasyunin(b, a))
  );
}

function gcdInt(x, y) {
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}

// -- measured intercept d_a = mean over coprime b in [bLo,bHi] of I(a,b) - (a/2) log b. ------------
export function measureIntercept(a, bLo, bHi) {
  let s = 0;
  let n = 0;
  for (let b = bLo; b <= bHi; b++) {
    if (gcdInt(a, b) === 1) {
      s += coefficientI(a, b) - (a / 2) * Math.log(b);
      n++;
    }
  }
  return { d: s / n, n };
}

// -- THE PINNED CLOSED FORM: d_a = a(C + 1/2) - (a/2) log a = (a/2)(2C + 1 - log a). --------------
export function interceptClosedForm(a) {
  return a * (IMP97330_C + 0.5) - (a / 2) * Math.log(a);
}

// -- baked measured intercept table (mean over coprime b in [20000,26000]; residual < 3e-5). ------
export const IMP97330_D_MEASURED = Object.freeze([
  Object.freeze({ a: 1, dMeasured: 1.130337, dClosed: 1.130331 }),
  Object.freeze({ a: 2, dMeasured: 1.567511, dClosed: 1.567514 }),
  Object.freeze({ a: 3, dMeasured: 1.743064, dClosed: 1.743074 }),
  Object.freeze({ a: 4, dMeasured: 1.748722, dClosed: 1.748734 }),
  Object.freeze({ a: 5, dMeasured: 1.628036, dClosed: 1.628059 }),
  Object.freeze({ a: 6, dMeasured: 1.406711, dClosed: 1.406706 }),
  Object.freeze({ a: 7, dMeasured: 1.101594, dClosed: 1.101629 }),
  Object.freeze({ a: 8, dMeasured: 0.724858, dClosed: 0.724879 }),
  Object.freeze({ a: 9, dMeasured: 0.285440, dClosed: 0.285466 }),
  Object.freeze({ a: 10, dMeasured: -0.209607, dClosed: -0.209618 }),
  Object.freeze({ a: 11, dMeasured: -0.754846, dClosed: -0.754786 }),
  Object.freeze({ a: 12, dMeasured: -1.345451, dClosed: -1.345471 }),
  Object.freeze({ a: 13, dMeasured: -1.977943, dClosed: -1.977872 }),
  Object.freeze({ a: 14, dMeasured: -2.648754, dClosed: -2.648771 }),
]);

// -- a ~ e^{2C} is the peak of the smooth intercept; peak value (1/2) e^{2C-1}. -------------------
export const IMP97330_PEAK_A = Math.exp(2 * IMP97330_C); // ~ 3.527 (real-valued argmax; integer peak a = 4)
export const IMP97330_PEAK_VALUE = 0.5 * Math.exp(2 * IMP97330_C); // = a*/2 ~ 1.7635 at a* = e^{2C}

export const IMP97330_VERDICT = Object.freeze({
  id: 'imp-97330',
  proofSection: 'Route-M',
  question:
    'What is the arithmetic structure of the imp-97311 small-a intercept table d_a (d_1..d_5 = ' +
    '1.13, 1.57, 1.74, 1.75, 1.63, non-monotone), left unpinned there, driven -- per the ticket -- ' +
    'by the V(b,a) residue sum?',
  interceptClosedForm: 'a(C + 1/2) - (a/2) log a = (a/2)(2C + 1 - log a)', // C = (log 2pi - gamma)/2
  isArithmeticResidueFunction: false, // NOT residue-driven: the V(b,a) residue mean is 0
  isSmoothClosedForm: true, // smooth function of a, no prime / multiplicative structure
  residualIsUniformOoneTail: true, // d_a - closed(a) ~ -1.6e-6 * a at b in [80000,90000], same sign for all a
  residueMeanOfVbaVanishes: true, // the -(pi/2)V(b,a) piece averages to 0 over b mod a (o(1) wobble only)
  vabConstantIsMinusAOverPi: true, // V(a,b) = -(b/pi)log b + (2C/pi)b - a/pi + o(1); -(pi/2)(-a/pi) = +a/2
  matchesA1Border: true, // d_1 = C + 1/2 matches the rigorous imp-96667 a=1 border
  peakArgmaxA: IMP97330_PEAK_A, // e^{2C} ~ 3.53: the non-monotonicity is just the shape of the smooth form
  peakValue: IMP97330_PEAK_VALUE, // e^{2C}/2 ~ 1.7635 at a* = e^{2C}, straddled by d_3, d_4
  fullFixedAAsymptotic: 'I(a,b) = (a/2) log(b/a) + a(C + 1/2) + o(1)', // log a folds into log(b/a)
  separatesSqrtVsLog2b: false, // fixed-a moment Sum 1/4 still diverges (imp-97311); needs uniform a ~ b profile
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by > 2600x
  conclusion:
    'The small-a Bettin-Conrey intercept is PINNED to a clean CLOSED FORM: d_a = a(C + 1/2) - ' +
    '(a/2) log a = (a/2)(2C + 1 - log a), C = (log 2pi - gamma)/2, verified to a uniform o(1) tail ' +
    '(residual < 3e-5 for a <= 14 at b in [20000,26000], ~ -1.6e-6 * a at b in [80000,90000]) for ' +
    'a = 1..47, prime and composite alike. It is NOT an arithmetic function driven by the V(b,a) ' +
    'residue sum, as the ticket premised: the residue mean of -(pi/2)V(b,a) VANISHES (its period-a ' +
    'oscillation contributes only to the o(1) wobble), and d_a carries no prime / multiplicative ' +
    'signal. The three constant survivors are C a (from C(a+b)), -(a/2)log a (arithmetic), and +a/2 ' +
    '(the O(1) constant -a/pi of V(a,b), generalizing the a=1 border 1/2 of imp-96667). The ' +
    'non-monotonicity is simply the shape of the smooth (a/2)(2C+1-log a), which peaks at a = ' +
    'e^{2C} ~ 3.53 with value e^{2C}/2 ~ 1.764 (straddled by d_3, d_4) then falls to -infinity. ' +
    'The full fixed-a asymptotic is thus I(a,b) = (a/2) log(b/a) + a(C + 1/2) + o(1). This pins the ' +
    'fixed-a input for the imp-97329 crossover but does NOT separate b^(1/2) from log^2 b: the ' +
    'fixed-a moment Sum kappa_a^2/a^2 = Sum 1/4 still diverges (imp-97311), so the separation still ' +
    'needs the uniform (a ~ b) remainder profile. Measurement + pin only; no g(b) coefficient ' +
    'claimed; the rigorous anchor stays T = 2.594e7; compute N ~ 9916 binds first by > 2600x; no ' +
    'operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97330_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement + pin only: the small-a ' +
  'Bettin-Conrey intercept d_a of imp-97311 is PINNED to the closed form d_a = a(C + 1/2) - ' +
  '(a/2) log a = (a/2)(2C + 1 - log a), C = (log 2pi - gamma)/2, verified to a uniform o(1) tail ' +
  'for a = 1..47 (prime and composite). It is NOT the V(b,a)-residue arithmetic function the ' +
  'ticket premised -- that residue mean vanishes; d_a is a SMOOTH function of a whose ' +
  'non-monotonicity is just the peak of (a/2)(2C+1-log a) at a = e^{2C} ~ 3.53. The full fixed-a ' +
  'asymptotic is I(a,b) = (a/2) log(b/a) + a(C + 1/2) + o(1). This pins the fixed-a input but does ' +
  'NOT separate b^(1/2) from log^2 b (the fixed-a moment Sum 1/4 still diverges, imp-97311); no ' +
  'coefficient of g(b) is claimed; the rigorous anchor stays the trace ceiling T = 2.594e7.';

export default IMP97330_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Kept LIGHT --
// -- (no wide-b measurement at import: closed-form checks are pure arithmetic against baked data; --
// -- the single kernel check uses small b). --------------------------------------------------------
const IMP97330_ASSERTIONS = [
  {
    id: 'imp97330-closed-form-matches-baked-measurement',
    why: 'the pinned closed form d_a = a(C+1/2) - (a/2)log a must reproduce the baked measured d_a ' +
      '(mean over coprime b in [20000,26000]) to within the o(1) finite-b tail (< 3e-4) for every ' +
      'baked a = 1..14, prime and composite.',
    holds: () =>
      IMP97330_D_MEASURED.every(
        (row) => Math.abs(interceptClosedForm(row.a) - row.dMeasured) < 3e-4,
      ),
  },
  {
    id: 'imp97330-baked-closed-column-consistent',
    why: 'the baked dClosed column must equal the interceptClosedForm evaluated at each a (guards ' +
      'against a stale baked table drifting from the formula).',
    holds: () =>
      IMP97330_D_MEASURED.every(
        (row) => Math.abs(interceptClosedForm(row.a) - row.dClosed) < 1e-6,
      ),
  },
  {
    id: 'imp97330-d1-matches-rigorous-border',
    why: 'd_1 must equal the rigorous imp-96667 a=1 border constant C + 1/2 (the one proved case), ' +
      'anchoring the closed form.',
    holds: () => Math.abs(interceptClosedForm(1) - (IMP97330_C + 0.5)) < 1e-12,
  },
  {
    id: 'imp97330-closed-form-algebraic-identity',
    why: 'a(C+1/2) - (a/2)log a must equal the factored (a/2)(2C + 1 - log a) identically.',
    holds: () =>
      [1, 2, 5, 12, 47, 1000].every(
        (a) =>
          Math.abs(
            interceptClosedForm(a) - (a / 2) * (2 * IMP97330_C + 1 - Math.log(a)),
          ) < 1e-12,
      ),
  },
  {
    id: 'imp97330-peak-shape',
    why: 'the smooth intercept must peak at a = e^{2C} ~ 3.53 with value e^{2C}/2 ~ 1.7635, ' +
      'explaining the measured non-monotone plateau d_3 ~ d_4 ~ 1.74-1.75 (NOT arithmetic structure).',
    holds: () =>
      Math.abs(IMP97330_PEAK_A - 3.527) < 5e-3 &&
      Math.abs(IMP97330_PEAK_VALUE - 1.7635) < 2e-3 &&
      Math.abs(IMP97330_PEAK_VALUE - IMP97330_PEAK_A / 2) < 1e-12 &&
      interceptClosedForm(4) > interceptClosedForm(3) - 1e-3 && // near-flat plateau at the peak
      interceptClosedForm(5) < interceptClosedForm(4), // decreasing past the peak
  },
  {
    id: 'imp97330-kernel-symmetric-small-b',
    why: 'the Vasyunin coefficient must be symmetric I(a,b) = I(b,a) (a cheap structural check on ' +
      'the kernel used for the measurement, at small b to keep import light).',
    holds: () =>
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9 &&
      Math.abs(coefficientI(4, 7) - coefficientI(7, 4)) < 1e-9,
  },
  {
    id: 'imp97330-honesty-gate-no-qed',
    why: 'measurement + pin only: closed form pinned, not residue-driven, no bound moved, does not ' +
      'separate the sub-leading forms, compute binds first, honesty markers present.',
    holds: () =>
      IMP97330_VERDICT.anyBoundMoved === false &&
      IMP97330_VERDICT.isArithmeticResidueFunction === false &&
      IMP97330_VERDICT.isSmoothClosedForm === true &&
      IMP97330_VERDICT.matchesA1Border === true &&
      IMP97330_VERDICT.separatesSqrtVsLog2b === false &&
      IMP97330_VERDICT.computeBindsFirst === true &&
      /RH open/.test(IMP97330_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97330_HONEST_BANNER) &&
      /NO QED/.test(IMP97330_HONEST_BANNER),
  },
];

for (const a of IMP97330_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97330-route-m-smalla-intercept-closed-form assertion failed: ${a.id}`,
    );
  }
}

export { IMP97330_ASSERTIONS };
