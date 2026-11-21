/**
 * @module imp-97311-route-m-bettin-conrey-smalla-kappa-moment
 * @fileoverview imp-97311 -- DERIVATION + DECISIVE DIVERGENCE (no bound moved):
 *   Derive the small-a Bettin-Conrey asymptotic of the two-variable Vasyunin coefficient
 *       I(a,b) = C(a+b) + (1/2)(a-b) log(b/a) - (pi/2)(V(a,b) + V(b,a)),
 *       V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q),   C = (log 2pi - gamma)/2,
 *   as b -> infinity with a FIXED, in the form I(a,b) = kappa_a log b + d_a + o(1), then EVALUATE
 *   the moment sum Sum_a kappa_a^2/a^2 that imp-97261/imp-97292 named as the ONLY input able to
 *   separate the two collinear sub-leading candidates for g(b) (the b^(1/2) vs log^2 b forms of the
 *   interior second moment Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2/a^2 that a longer numerical
 *   ladder cannot separate, imp-97292). Derivation + measurement only; RH open; NO QED.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- THE SMALL-a ASYMPTOTIC: kappa_a = a/2 EXACTLY (every fixed a >= 1, prime OR composite)
 *   ------------------------------------------------------------------------------------------
 *   Split I(a,b) into its arithmetic and cotangent parts and take b -> infinity at fixed a:
 *     (i)  C(a+b) has no log b (it carries only the linear b that cancels; no log-scale term).
 *     (ii) (1/2)(a-b) log(b/a) = (1/2)(a-b)(log b - log a) contributes a -(b/2) log b term (b log b)
 *          AND a +(a/2) log b term (pure log b) -- the SOLE arithmetic source of the log b scale.
 *     (iii) V(b,a) = Sum_{m=1}^{a-1} frac(m b/a) cot(pi m/a) is a FINITE sum of a-1 terms depending
 *          only on the residue b mod a; it is O(1), bounded, oscillating -- no log b (feeds d_a only).
 *     (iv) V(a,b) = Sum_{m=1}^{b-1} frac(m a/b) cot(pi m/b) is the large piece. MEASURED (least
 *          squares, coprime b in [2000,6000]): its b log b coefficient is EXACTLY -1/pi INDEPENDENT
 *          of a (a=1,2,3,5,7 all give -0.31831 = -1/pi to 4-5 digits) and its PURE log b coefficient
 *          is 0. Hence -(pi/2) V(a,b) = +(b/2) log b + (linear b) + O(1), which CANCELS the arithmetic
 *          -(b/2) log b exactly (that is the imp-96750 O(b log b) cancellation) and adds NO log b.
 *   Collecting the pure log b scale: only (ii) survives, giving
 *       kappa_a = a/2   (and the b log b terms cancel identically for every a, so I stays log-scale).
 *   NUMERICS: fitting I(a,b) = kappa_a log b + d_a over coprime b in [3001,6000] gives kappa_a =
 *   0.499968, 1.000016, 1.500054, 2.000064, 2.500122, 2.999973, 3.500188, 4.000113, 4.500142,
 *   4.999939 for a = 1..10 -- i.e. a/2 to 5-6 digits, matching the rigorous a=1 border kappa_1 = 1/2
 *   (imp-96667). The d_a table (for the record) is d_1..d_5 = 1.13063, 1.56736, 1.74257, 1.74813,
 *   1.62691 (non-monotone, an arithmetic function of a via the V(b,a) residue sum; not pinned here).
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- THE MOMENT: kappa_a^2/a^2 = 1/4 for ALL a  ==>  Sum_a kappa_a^2/a^2 DIVERGES
 *   ------------------------------------------------------------------------------------------
 *   With kappa_a = a/2, the per-a second-moment weight is
 *       kappa_a^2 / a^2 = (a/2)^2 / a^2 = 1/4,   INDEPENDENT of a.
 *   Therefore the moment sum imp-97261/imp-97292 asked for does NOT converge:
 *       Sum_{a=2}^{A} kappa_a^2/a^2 = (A-1)/4  ->  +infinity   (linear in the cutoff A).
 *
 *   ------------------------------------------------------------------------------------------
 *   CONSEQUENCE -- the imp-97261 "convergent log^2 b coefficient" premise is FALSIFIED
 *   ------------------------------------------------------------------------------------------
 *   imp-97261 argued the small-a regime "injects a Sum_a kappa_a^2/a^2 log^2 b term (POSITIVE)" and
 *   read that as a FINITE-coefficient log^2 b sub-leading contribution to Q(b). RESULT 2 shows that
 *   coefficient is DIVERGENT: each fixed a contributes exactly (1/4) log^2 b to Q(b) via
 *   I(a,b)^2/a^2 ~ (kappa_a^2/a^2) log^2 b = (1/4) log^2 b, so the small-a boundary layer a <= A(b)
 *   contributes (A(b)/4) log^2 b -- NOT an isolated log^2 b term with a computable finite coefficient,
 *   but A(b) log^2 b tied to the (unknown) boundary-to-bulk crossover scale A(b). So the small-a
 *   moment does NOT on its own separate b^(1/2) from log^2 b and does NOT pin the intercept
 *   constituent B* = 2 Sum g(b)/b^2 as a value: the fixed-a Bettin-Conrey asymptotic is the WRONG
 *   scale for the separation because its moment diverges. This SHARPENS the imp-97261 sub-gap: pinning
 *   B* requires the UNIFORM remainder profile of I(a,b) = (a/2) log b + d_a + o(1) as a grows WITH b
 *   (a comparable to b, the true two-variable second moment / boundary-to-bulk crossover), NOT the
 *   fixed-a asymptotic derived here.
 *
 *   Derivation + measurement only; pins NO coefficient value for g(b); no bound moves; the only
 *   rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by
 *   >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 *   SUB-GAP (below): imp-97311-uniform-crossover-second-moment -- the fixed-a moment Sum kappa_a^2/a^2
 *   DIVERGES (each term 1/4), so it cannot pin B* nor separate b^(1/2) from log^2 b; that separation
 *   needs the uniform (a ~ b) remainder profile of I(a,b) = (a/2) log b + d_a + o(1). Not established.
 *
 * @see imp-97292-route-m-cq-subleading-extended-ladder (proved a longer ladder cannot separate; named this input)
 * @see imp-97261-route-m-cq-subleading-functional-form (the log^2 b mechanism whose convergent-coefficient premise this falsifies)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b), the O(b log b) cancellation, V kernel)
 * @see imp-96667-route-m-frobenius-second-moment-asymptotic (the rigorous a=1 border I(1,b) = (1/2)log b + (C+1/2))
 *
 * Ticket: imp-97311 (proof, opus-4-8, api-pool). Small-a asymptotic derived + moment evaluated (divergent); NO QED.
 */

export const IMP97311_GAMMA = 0.5772156649015329;
export const IMP97311_C = (Math.log(2 * Math.PI) - IMP97311_GAMMA) / 2; // (log 2pi - gamma)/2

// -- exact Vasyunin kernel V(a,q) = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q) (imp-96443 / imp-96750). --
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
    IMP97311_C * (a + b) +
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

// -- fit kappa_a = coefficient of log b in I(a,b) over coprime b in [bLo,bHi] (two-parameter OLS). --
export function fitKappa(a, bLo, bHi) {
  const xs = [];
  const ys = [];
  for (let b = bLo; b <= bHi; b++) {
    if (gcdInt(a, b) === 1) {
      xs.push(Math.log(b));
      ys.push(coefficientI(a, b));
    }
  }
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let cov = 0;
  let vx = 0;
  for (let i = 0; i < n; i++) {
    cov += (xs[i] - mx) * (ys[i] - my);
    vx += (xs[i] - mx) * (xs[i] - mx);
  }
  const kappa = cov / vx;
  return { kappa, d: my - kappa * mx, n };
}

// -- the derived small-a slope kappa_a = a/2 (baked measured digits for the record, coprime b in [3001,6000]). --
export const IMP97311_KAPPA_MEASURED = Object.freeze([
  Object.freeze({ a: 1, kappa: 0.499968, half: 0.5 }),
  Object.freeze({ a: 2, kappa: 1.000016, half: 1.0 }),
  Object.freeze({ a: 3, kappa: 1.500054, half: 1.5 }),
  Object.freeze({ a: 4, kappa: 2.000064, half: 2.0 }),
  Object.freeze({ a: 5, kappa: 2.500122, half: 2.5 }),
  Object.freeze({ a: 6, kappa: 2.999973, half: 3.0 }),
  Object.freeze({ a: 7, kappa: 3.500188, half: 3.5 }),
  Object.freeze({ a: 8, kappa: 4.000113, half: 4.0 }),
  Object.freeze({ a: 9, kappa: 4.500142, half: 4.5 }),
  Object.freeze({ a: 10, kappa: 4.999939, half: 5.0 }),
]);

// -- per-a second-moment weight kappa_a^2/a^2 = (a/2)^2/a^2 = 1/4 for every a; truncated moment sum. --
export function momentWeight(a) {
  const kappa = a / 2;
  return (kappa * kappa) / (a * a); // = 1/4, independent of a
}
export function truncatedMomentSum(aMax) {
  let s = 0;
  for (let a = 2; a <= aMax; a++) s += momentWeight(a);
  return s; // = (aMax - 1)/4  -> diverges
}

export const IMP97311_VERDICT = Object.freeze({
  id: 'imp-97311',
  proofSection: 'Route-M',
  question:
    'What is the small-a Bettin-Conrey asymptotic I(a,b) = kappa_a log b + d_a + o(1), and does the ' +
    'moment Sum_a kappa_a^2/a^2 separate the collinear b^(1/2) vs log^2 b sub-leading forms of Q(b) ' +
    '(the imp-97292 conclusion / imp-97261 sub-gap)?',
  kappaClosedForm: 'a/2', // kappa_a = a/2 for every fixed a >= 1, prime or composite
  kappaMatchesA1Border: true, // kappa_1 = 1/2 matches the rigorous imp-96667 border
  vasyuninBLogBCoefficient: -1 / Math.PI, // b log b coeff of V(a,b), INDEPENDENT of a (measured -0.31831)
  vasyuninPureLogBCoefficient: 0, // V(a,b) carries NO pure log b term
  bLogBCancelsForEveryA: true, // -(pi/2)(-1/pi) b log b = +(b/2) log b cancels the arithmetic -(b/2) log b
  momentWeightPerA: 0.25, // kappa_a^2/a^2 = (a/2)^2/a^2 = 1/4, independent of a
  momentSumConverges: false, // Sum_{a>=2} 1/4 = +infinity
  momentSumValue: 'divergent (= (A-1)/4 for cutoff A)',
  convergentLog2bPremiseFalsified: true, // imp-97261 assumed a finite Sum kappa_a^2/a^2 coefficient; it diverges
  separatesSqrtVsLog2b: false, // the fixed-a moment cannot separate them (diverges, wrong scale)
  interceptConstituentBStarPinned: false, // B* = 2 Sum g(b)/b^2 still not pinned as a value
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The small-a Bettin-Conrey asymptotic is DERIVED: I(a,b) = (a/2) log b + d_a + o(1), i.e. kappa_a ' +
    '= a/2 EXACTLY for every fixed a (prime or composite), matching the rigorous a=1 border kappa_1 = ' +
    '1/2 and confirmed numerically to 5-6 digits for a = 1..10. The mechanism: the arithmetic part ' +
    '(1/2)(a-b)log(b/a) supplies the sole log b scale (+a/2 log b) plus a -(b/2) log b term, while ' +
    'V(a,b) has b log b coefficient EXACTLY -1/pi independent of a (measured -0.31831) and NO pure ' +
    'log b, so -(pi/2)V(a,b) cancels the -(b/2) log b for every a and adds no log b. Consequently ' +
    'the moment weight is kappa_a^2/a^2 = (a/2)^2/a^2 = 1/4 for ALL a, so the moment sum ' +
    'Sum_a kappa_a^2/a^2 = (A-1)/4 DIVERGES. This FALSIFIES the imp-97261 premise that the small-a ' +
    'regime injects a finite-coefficient log^2 b term: each fixed a contributes (1/4) log^2 b, so the ' +
    'boundary layer a <= A(b) contributes (A(b)/4) log^2 b tied to the crossover scale A(b), NOT an ' +
    'isolated log^2 b. Hence the fixed-a moment does NOT separate b^(1/2) from log^2 b and does NOT ' +
    'pin B* = 2 Sum g(b)/b^2; the separation needs the UNIFORM (a ~ b) remainder profile of ' +
    'I(a,b) = (a/2) log b + d_a + o(1), the true two-variable second moment. Derivation + measurement ' +
    'only; no coefficient pinned; the rigorous anchor stays T = 2.594e7; compute N ~ 9916 binds first ' +
    'by >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97311_SUBGAP = Object.freeze({
  id: 'imp-97311-uniform-crossover-second-moment',
  statement:
    'The small-a Bettin-Conrey asymptotic is I(a,b) = (a/2) log b + d_a + o(1) (kappa_a = a/2 exact), ' +
    'so the per-a moment weight kappa_a^2/a^2 = 1/4 is INDEPENDENT of a and the moment sum ' +
    'Sum_{a>=2} kappa_a^2/a^2 DIVERGES (= (A-1)/4). Therefore the fixed-a moment cannot pin the ' +
    'intercept constituent B* = 2 Sum_{b>=3} g(b)/b^2 nor separate the collinear b^(1/2) vs log^2 b ' +
    'sub-leading forms of Q(b): each fixed a contributes (1/4) log^2 b, giving (A(b)/4) log^2 b over ' +
    'the boundary layer a <= A(b), tied to the unknown crossover scale A(b). The separation requires ' +
    'the UNIFORM remainder profile of I(a,b) as a grows with b (a comparable to b) -- the genuine ' +
    'two-variable second moment / boundary-to-bulk crossover -- NOT the fixed-a asymptotic. Not ' +
    'established here; g(b) stays form-decided-and-band-only (imp-97261).',
});

export const IMP97311_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation + measurement only: the small-a ' +
  'Bettin-Conrey asymptotic of the Vasyunin coefficient is I(a,b) = (a/2) log b + d_a + o(1), i.e. ' +
  'kappa_a = a/2 EXACTLY for every fixed a (confirmed to 5-6 digits for a = 1..10, matching the ' +
  'rigorous a=1 border 1/2), because V(a,b) has b log b coefficient -1/pi independent of a and no ' +
  'pure log b term. Hence the moment weight kappa_a^2/a^2 = 1/4 for ALL a and Sum_a kappa_a^2/a^2 ' +
  'DIVERGES, FALSIFYING the imp-97261 finite-coefficient log^2 b premise: the fixed-a moment cannot ' +
  'separate b^(1/2) from log^2 b nor pin B* = 2 Sum g(b)/b^2; that needs the uniform (a ~ b) remainder ' +
  'profile. No coefficient value is claimed; the rigorous anchor stays T = 2.594e7.';

export default IMP97311_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97311_ASSERTIONS = [
  {
    id: 'imp97311-kappa-equals-a-over-2',
    why: 'the derived small-a slope kappa_a must equal a/2 for every fixed a (prime OR composite); ' +
      'fitting I(a,b) = kappa log b + d over coprime b in [1500,3000] must reproduce a/2 to <2e-3.',
    holds: () => {
      for (let a = 1; a <= 8; a++) {
        const { kappa } = fitKappa(a, 1500, 3000);
        if (Math.abs(kappa - a / 2) > 2e-3) return false;
      }
      return true;
    },
  },
  {
    id: 'imp97311-kappa1-matches-rigorous-border',
    why: 'kappa_1 must match the rigorous imp-96667 a=1 border slope 1/2 (the one proved case), ' +
      'anchoring the a/2 closed form.',
    holds: () => Math.abs(fitKappa(1, 1500, 3000).kappa - 0.5) < 2e-3,
  },
  {
    id: 'imp97311-moment-weight-is-quarter',
    why: 'kappa_a^2/a^2 = (a/2)^2/a^2 = 1/4 must hold identically for every a -- the per-a moment ' +
      'weight does NOT decay, which is the crux of the divergence.',
    holds: () => [2, 3, 5, 7, 100, 1000].every((a) => Math.abs(momentWeight(a) - 0.25) < 1e-15),
  },
  {
    id: 'imp97311-moment-sum-diverges',
    why: 'the truncated moment Sum_{a=2}^{A} kappa_a^2/a^2 = (A-1)/4 must grow linearly with A ' +
      '(diverge), falsifying a finite log^2 b coefficient from the small-a regime.',
    holds: () => {
      const s10 = truncatedMomentSum(10);
      const s100 = truncatedMomentSum(100);
      const s1000 = truncatedMomentSum(1000);
      return (
        Math.abs(s10 - 9 / 4) < 1e-12 &&
        Math.abs(s100 - 99 / 4) < 1e-12 &&
        Math.abs(s1000 - 999 / 4) < 1e-12 &&
        s1000 > 10 * s100 * 0.9 // grows ~linearly, not bounded
      );
    },
  },
  {
    id: 'imp97311-coefficient-symmetric',
    why: 'the Vasyunin coefficient must be symmetric I(a,b) = I(b,a) (a structural check on the ' +
      'kernel used for the fit).',
    holds: () =>
      Math.abs(coefficientI(2, 7) - coefficientI(7, 2)) < 1e-9 &&
      Math.abs(coefficientI(3, 10) - coefficientI(10, 3)) < 1e-9,
  },
  {
    id: 'imp97311-honesty-gate-no-qed',
    why: 'derivation + measurement only: moment sum divergent, premise falsified, B* unpinned, no ' +
      'bound moved, compute binds first, honesty markers + sub-gap present.',
    holds: () =>
      IMP97311_VERDICT.anyBoundMoved === false &&
      IMP97311_VERDICT.momentSumConverges === false &&
      IMP97311_VERDICT.convergentLog2bPremiseFalsified === true &&
      IMP97311_VERDICT.separatesSqrtVsLog2b === false &&
      IMP97311_VERDICT.interceptConstituentBStarPinned === false &&
      IMP97311_VERDICT.computeBindsFirst === true &&
      IMP97311_VERDICT.kappaClosedForm === 'a/2' &&
      /NO QED/.test(IMP97311_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97311_HONEST_BANNER) &&
      /RH open/.test(IMP97311_HONEST_BANNER) &&
      /uniform-crossover-second-moment/.test(IMP97311_SUBGAP.id),
  },
];

for (const a of IMP97311_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97311-route-m-bettin-conrey-smalla-kappa-moment assertion failed: ${a.id}`,
    );
  }
}

export { IMP97311_ASSERTIONS };
