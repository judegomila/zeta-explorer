/**
 * @module imp-96830-uniform-cotangent-second-moment-literature-assessment
 *
 * imp-96830 (proof/assessment ONLY, literature survey + structural analysis; no numerics):
 * imp-96795 Finding 3 named the precise obstruction to proving the coprime-core Vasyunin
 * second moment T(N) = Sum_{gcd(a,b)=1, a,b<=N} I(a,b)^2 / (a^2 b^2) satisfies a clean growth
 * law: it wants a UNIFORM (in BOTH free arguments) Bettin-Conrey / Maier-Rassias cotangent-sum
 * second moment against the coprimality-restricted 1/(a^2 b^2) weight, whereas the literature
 * was stated to supply only the FIXED-DENOMINATOR case. This module surveys exactly which
 * uniform cotangent-sum second-moment results are actually available, whether any covers the
 * coupled weighted double sum T(N) needs, and precisely what the gap is.
 *
 * No bound is proved; no refereed bound is changed; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * THE OBJECT. The Vasyunin integral I(a,b) is NOT the bare cotangent sum. In the pinned
 * closed form (imp-96828 kernel) it couples both arguments non-symmetrically:
 *   I(h,k) = C_VAS (h+k) + (1/2)(h-k) log(k/h) - (pi/2)[ V(h/k) + V((k mod h)/h) ],
 *   V(h/k) = Sum_{m=1}^{k-1} frac(m h / k) cot(pi m / k).
 * So I(a,b) is built from TWO Vasyunin cotangent sums, one at denominator k=b and one at the
 * reduced denominator h=a, entangling a and b. T(N) is the coprime double sum of I(a,b)^2
 * against the coupled weight 1/(a^2 b^2), with a,b ranging INDEPENDENTLY over [1,N].
 *
 * -------------------------------------------------------------------------------
 * WHAT THE LITERATURE ACTUALLY SUPPLIES (survey). Three families, all essentially
 * single-denominator or distributional, NONE a coupled weighted two-argument second moment.
 * -------------------------------------------------------------------------------
 *  (L1) Bettin-Conrey (2013), "A reciprocity formula for a cotangent sum" (IMRN) and
 *       "Period functions and cotangent sums" (Algebra and Number Theory 7). Supplies the EXACT
 *       reciprocity c_0(h/k) + (k/h) c_0(k/h) = elementary + Eisenstein period function, and the
 *       value distribution / analytic continuation of the Estermann-attached cotangent sum. This
 *       is an identity in the two arguments, not a second-moment ASYMPTOTIC; it controls the
 *       functional relation, not the size of a weighted sum of squares.
 *  (L2) Maier-Rassias (2016-2019) and Bettin-Drappeau, moment asymptotics: for a FIXED
 *       denominator k, Sum_{(h,k)=1, 1<=h<k} c_0(h/k)^2 grows like k^2 log k (and higher even
 *       moments accordingly); Bettin-Drappeau, "Limit laws for cotangent sums", give the limiting
 *       (stable, Cauchy-type) value distribution of c_0(h/k) as h varies over a fixed large k.
 *       These are UNIFORM IN h but for ONE denominator at a time -- exactly the "fixed-denominator"
 *       case imp-96795 named. Averaging the h-moment over k afterwards gives a single-scale
 *       average, not a joint bound uniform in a coupled second argument.
 *  (L3) Successor value-distribution work (Bettin 2015; Marklof-style equidistribution of
 *       cotangent sums) gives distributional convergence of c_0(h/k) over Farey / Stern-Brocot
 *       families, again a single-parameter limit law -- convergence in distribution, not a sharp
 *       weighted-double-sum constant.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the fixed-denominator second moment IS genuinely available (L2); the h-uniform
 * leg of the obstruction is real literature, not a gap.
 * -------------------------------------------------------------------------------
 * The Maier-Rassias / Bettin-Drappeau second moment Sum_{(h,k)=1} c_0(h/k)^2 ~ c k^2 log k is a
 * bona-fide uniform-in-h result for each fixed k. imp-96795 characterized this correctly: the
 * fixed-denominator case is settled.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 (DECISIVE) -- what T(N) needs is NOT a verbatim corollary, for TWO independent
 * reasons; the obstruction is a genuine assembly gap, not merely an unwritten corollary.
 * -------------------------------------------------------------------------------
 *  (2a) COUPLING. I(a,b)^2 is a product of TWO cotangent sums at DIFFERENT denominators
 *       (V at k=b and V at h=a), summed over the full coprime square with a,b independent. A
 *       fixed-k second moment controls Sum_h V(h/k)^2 for one k; it does not control the coupled
 *       cross terms V(a/b) V((b mod a)/a) that a two-argument uniform statement must handle. No
 *       diagonal-in-k reduction is available because the weight and the kernel both mix a and b.
 *  (2b) WRONG REGIME (the weight defeats the moment asymptotic). The 1/(a^2 b^2) weight
 *       concentrates T(N) on SMALL a,b; the k^2 log k moment growth lives at LARGE denominators,
 *       precisely the regime the weight suppresses (k^2 log k divided by ~k^4 weight is summable
 *       with only a logarithmic tail). So even a perfect joint-uniform second moment would NOT
 *       hand over the T(N) growth constant directly: the growth of T(N) is a slowly-accumulating
 *       TAIL effect, not the leading moment asymptotic. This is corroborated numerically --
 *       imp-96828 MEASURED T(N) ~ 3.54 log N (linear in log N), NOT the (log N)^2 the naive
 *       moment-count would suggest, exactly because the weight kills the bulk moment growth.
 *
 * -------------------------------------------------------------------------------
 * VERDICT. The obstruction is PART unassembled-corollary, PART genuinely open -- and imp-96795
 * mis-located which part is missing.
 * -------------------------------------------------------------------------------
 * The h-uniform, fixed-denominator second moment (L2) is real and available. The missing piece
 * is NOT a stronger cotangent-sum moment; it is the COUPLED, WEIGHTED, two-argument assembly:
 * a uniform estimate for Sum_{gcd(a,b)=1} I(a,b)^2/(a^2 b^2) with I the Vasyunin integral (a
 * PRODUCT of two cotangent sums at different reduced denominators) against a weight that shifts
 * the operative regime to SMALL arguments, where the large-denominator moment asymptotics do not
 * apply. This is a genuine analytic assembly problem, not a verbatim corollary of Bettin-Conrey /
 * Maier-Rassias -- but it is also NOT the deep open moment problem imp-96795 implied, because the
 * hard leg (the h-uniform moment) is already in hand and, per imp-96828, the weighted growth is
 * only logarithmic. The residual is: a tail-regime, coupled, weighted double-sum estimate for the
 * Vasyunin integral -- unwritten in the literature, but of modest analytic depth given L1-L2.
 * No bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96795-route-m-frobenius-g-factorization-route-independence-assessment.js (named the obstruction)
 * @see imp-96828-coprime-core-vasyunin-second-moment-growth.js (measured T(N) ~ 3.54 log N)
 * @see imp-96688-route-m-frobenius-g-factorization-assessment.js (the exact T(N) factorization)
 * @see rh-route-m-nyman-beurling-vasyunin-reciprocity-2026-09-23.js (VASYUNIN_FORMULA kernel)
 *
 * Ticket: imp-96830 (proof, opus-4-8, api-pool). Assessment only; NO QED.
 */

// The literature families surveyed. Each records whether it is UNIFORM in both free arguments
// and whether it is a coupled WEIGHTED second moment of the kind T(N) needs.
export const IMP96830_LITERATURE = Object.freeze([
  Object.freeze({
    key: 'L1-bettin-conrey-reciprocity',
    refs: 'Bettin-Conrey 2013 (IMRN reciprocity; Algebra and Number Theory period functions)',
    supplies: 'exact reciprocity c_0(h/k)+(k/h)c_0(k/h)=elementary+Eisenstein period function; value continuation',
    uniformInBothArguments: true, // it is an identity in both, but...
    isSecondMomentAsymptotic: false, // ...a functional relation, not a size estimate
    coversCoupledWeightedDoubleSum: false,
  }),
  Object.freeze({
    key: 'L2-maier-rassias-bettin-drappeau-moments',
    refs: 'Maier-Rassias 2016-2019; Bettin-Drappeau, Limit laws for cotangent sums',
    supplies: 'Sum_{(h,k)=1} c_0(h/k)^2 ~ c k^2 log k for FIXED k; limiting (stable/Cauchy-type) value distribution over h',
    uniformInBothArguments: false, // uniform in h, one denominator k at a time
    isSecondMomentAsymptotic: true,
    coversCoupledWeightedDoubleSum: false, // fixed-denominator only
  }),
  Object.freeze({
    key: 'L3-value-distribution-successors',
    refs: 'Bettin 2015; equidistribution of cotangent sums over Farey/Stern-Brocot families',
    supplies: 'distributional convergence of c_0(h/k) over single-parameter Farey families',
    uniformInBothArguments: false,
    isSecondMomentAsymptotic: false, // convergence in distribution, not a sharp weighted constant
    coversCoupledWeightedDoubleSum: false,
  }),
]);

// The two independent reasons the fixed-denominator second moment does not port to T(N).
export const IMP96830_GAP = Object.freeze({
  reasonCoupling:
    'I(a,b)^2 is a PRODUCT of two Vasyunin cotangent sums at DIFFERENT reduced denominators ' +
    '(V at k=b and V at h=a), summed over the full coprime square with a,b independent; a ' +
    'fixed-k second moment controls one denominator and cannot handle the coupled cross terms.',
  reasonWrongRegime:
    'the 1/(a^2 b^2) weight concentrates T(N) on SMALL a,b, whereas the k^2 log k moment growth ' +
    'lives at LARGE denominators -- the regime the weight suppresses; so even a perfect joint ' +
    'second moment does not hand over the T(N) growth constant, which is a logarithmic TAIL ' +
    'effect (corroborated: imp-96828 measured T(N) ~ 3.54 log N, not the naive moment (log N)^2).',
  hUniformLegAlreadyAvailable: true, // the hard fixed-denominator moment IS in the literature (L2)
});

export const IMP96830_VERDICT = Object.freeze({
  question:
    'does the Bettin-Conrey / Maier-Rassias cotangent-sum second-moment literature supply a ' +
    'UNIFORM (in both free arguments) estimate against the coprimality-restricted 1/(a^2 b^2) ' +
    'weight, or only the fixed-denominator case?',
  onlyFixedDenominatorAvailable: true,
  coupledWeightedUniformStatementAvailable: false,
  obstructionIsGenuineOpenProblem: false, // not the deep open moment problem imp-96795 implied
  obstructionIsUnassembledCorollary: false, // nor a verbatim corollary -- it is between the two
  obstructionClassification:
    'a coupled, WEIGHTED, tail-regime two-argument double-sum estimate for the Vasyunin integral ' +
    'I(a,b) (a product of two cotangent sums at different reduced denominators) -- unwritten in ' +
    'the literature, but of MODEST depth: the hard h-uniform leg (L2) is already available and, ' +
    'per imp-96828, the weighted growth is only logarithmic, not the moment-count (log N)^2.',
  imp96795MislocatedTheGap:
    'imp-96795 named the missing piece as a stronger uniform cotangent-sum second moment; in fact ' +
    'the moment (L2) exists -- the missing piece is the coupled weighted assembly, and the weight ' +
    'shifts the operative regime to small arguments where moment asymptotics do not apply.',
  anyBoundMoved: false,
});

export const IMP96830_HONEST_BANNER =
  'Literature assessment only. The cotangent-sum second-moment literature (Bettin-Conrey ' +
  'reciprocity; Maier-Rassias / Bettin-Drappeau moments) supplies the FIXED-DENOMINATOR second ' +
  'moment Sum_{(h,k)=1} c_0(h/k)^2 ~ c k^2 log k uniformly in h, plus value-distribution limit ' +
  'laws -- but NO coupled, weighted, two-argument uniform statement of the kind T(N) needs. The ' +
  'gap is a coupled tail-regime weighted double sum for the Vasyunin integral, not a stronger ' +
  'moment; imp-96795 mis-located it. No growth law and no bound are proved. No refereed bound is changed' +
  '; RH open; NO QED.';

export const IMP96830_SUBGAP = Object.freeze({
  id: 'imp-96830-coupled-weighted-vasyunin-double-sum-unwritten-but-modest',
  statement:
    'What T(N) needs is a uniform estimate for Sum_{gcd(a,b)=1} I(a,b)^2/(a^2 b^2) with I the ' +
    'Vasyunin integral (a product of two cotangent sums at different reduced denominators), a,b ' +
    'independent over [1,N]. The h-uniform fixed-denominator second moment (Maier-Rassias / ' +
    'Bettin-Drappeau) is available; the coupled, weighted, small-argument-dominated assembly is ' +
    'not written down, but its analytic depth is modest given the fixed-denominator moment and ' +
    'the measured logarithmic (not quadratic) growth (imp-96828).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// LIGHT: structural consistency of the survey record; no heavy imports, no numerics.

const IMP96830_ASSERTIONS = [
  {
    id: 'imp96830-no-family-covers-coupled-weighted-double-sum',
    holds: () =>
      IMP96830_LITERATURE.length === 3 &&
      IMP96830_LITERATURE.every((f) => f.coversCoupledWeightedDoubleSum === false),
    why: 'none of the three surveyed literature families (reciprocity, fixed-k moments, value-distribution) supplies the coupled weighted two-argument second moment T(N) needs.',
  },
  {
    id: 'imp96830-fixed-denominator-moment-is-available',
    holds: () => {
      const l2 = IMP96830_LITERATURE.find((f) => f.key === 'L2-maier-rassias-bettin-drappeau-moments');
      return (
        !!l2 &&
        l2.isSecondMomentAsymptotic === true &&
        l2.uniformInBothArguments === false &&
        IMP96830_GAP.hUniformLegAlreadyAvailable === true
      );
    },
    why: 'the Maier-Rassias / Bettin-Drappeau fixed-denominator second moment (uniform in h, one k at a time) is genuinely available -- the h-uniform leg is real literature, not a gap.',
  },
  {
    id: 'imp96830-gap-has-two-independent-reasons',
    holds: () =>
      /PRODUCT of two Vasyunin cotangent sums/.test(IMP96830_GAP.reasonCoupling) &&
      /concentrates T\(N\) on SMALL a,b/.test(IMP96830_GAP.reasonWrongRegime) &&
      /3\.54 log N/.test(IMP96830_GAP.reasonWrongRegime),
    why: 'the fixed-denominator moment does not port for two independent reasons -- kernel coupling and the weight shifting the operative regime to small arguments (corroborated by the measured logarithmic growth).',
  },
  {
    id: 'imp96830-verdict-fixed-only-not-coupled',
    holds: () =>
      IMP96830_VERDICT.onlyFixedDenominatorAvailable === true &&
      IMP96830_VERDICT.coupledWeightedUniformStatementAvailable === false &&
      IMP96830_VERDICT.obstructionIsGenuineOpenProblem === false &&
      IMP96830_VERDICT.obstructionIsUnassembledCorollary === false,
    why: 'the literature supplies only the fixed-denominator case; the coupled weighted uniform statement is unavailable; and the obstruction sits between deep-open and verbatim-corollary.',
  },
  {
    id: 'imp96830-honesty-gate-no-qed',
    holds: () =>
      IMP96830_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96830_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96830_HONEST_BANNER) &&
      /RH open/.test(IMP96830_HONEST_BANNER) &&
      /coupled-weighted-vasyunin-double-sum/.test(IMP96830_SUBGAP.id),
    why: 'assessment only: no bound moved, honesty markers present, and the coupled-weighted-assembly sub-gap is recorded.',
  },
];

for (const a of IMP96830_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96830-uniform-cotangent-second-moment-literature-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  literature: IMP96830_LITERATURE,
  gap: IMP96830_GAP,
  verdict: IMP96830_VERDICT,
  banner: IMP96830_HONEST_BANNER,
  subgap: IMP96830_SUBGAP,
};
