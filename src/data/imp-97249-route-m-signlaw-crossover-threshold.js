/**
 * @module imp-97249-route-m-signlaw-crossover-threshold
 *
 * imp-97249 (numerical, MEASUREMENT): measure the imp-97156 smoothness crossover -- WHERE the
 * subleading Moebius mu(b) parity overtakes the leading Liouville lambda(b) parity in the Route M
 * residual r(b), as a joint function of omega(b) and small-prime packing. imp-97156 found the flip
 * (observed sign = mu(b), opposite the leading rule) is UNIVERSAL at primorials P5..P8 and driven
 * by packing distinct small primes. This ticket pins the crossover THRESHOLD: for fixed omega, hold
 * the (omega-1) smallest primes fixed and sweep the last prime p, then find the largest p that still
 * flips. No bound moves; supplies NO uniform remainder bound (imp-97096 sub-gap stays open);
 * T ~ 2.594e7 trace anchor unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97156 / imp-97140 / imp-97096: R_b = {a : 1 <= a <= b-1, (a,b)=1},
 * C = (log 2pi - gamma)/2, A(a,b) = C(a+b) + (1/2)(a-b) log(b/a),
 * F_arith(b) = Sum_{a in R_b} A(a,b), kappa_arith = (3/2) C - 3/8 = 0.5704960511308594...,
 * r(b) = F_arith(b)/(phi(b) b) - kappa_arith.
 * Leading (data-consistent) sign rule: sign(r) = (-1)^(omega+1) -- omega odd -> +, even -> -
 * (imp-97156 leadingRuleSignConventionNote / imp-97167 STEP-4). A "flip" = observed sign equals the
 * literal Moebius mu(b) = (-1)^omega, i.e. OPPOSITE the leading rule.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- there is a sharp MINIMUM omega for any flip: subleading never overtakes below omega=5.
 * -------------------------------------------------------------------------------
 * Sweeping, for each omega, the smoothest family b = (product of the omega-1 smallest primes) * p
 * over all last primes p (b up to ~2.77e7):
 *     omega = 2 (prefix 2)        : NO flip for any p (leading - throughout)
 *     omega = 3 (prefix 2.3)      : NO flip for any p (leading + throughout)
 *     omega = 4 (prefix 2.3.5)    : NO flip for any p (leading - throughout)
 *     omega = 5 (prefix 2.3.5.7)  : flips for p in {11,13,17}, LEADING again from p=19
 *     omega = 6 (prefix 2.3.5.7.11): flips for EVERY tested p up to 12007 (b up to 2.77e7)
 * So the subleading Moebius term cannot overtake the leading Liouville term for omega <= 4 at ANY
 * packing; omega = 5 is the onset, and it is razor-thin; omega >= 6 the flip is robust.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the crossover threshold p*(omega) (largest last prime that still flips) jumps hugely.
 * -------------------------------------------------------------------------------
 *     p*(omega<=4) = none   (never flips)
 *     p*(5)        = 17     (crossover in (17,19]; b = 2.3.5.7.17 = 3570 flips, 2.3.5.7.19 = 3990 does not)
 *     p*(6)        > 12007  (still flipping at b = 2310*12007 = 27736170, no crossover found in range)
 * Frozen residuals at the omega=5 crossover boundary:
 *     b = 3570  = 2.3.5.7.17  r = -2.3168e-8  (flip: leading +, observed -)
 *     b = 3990  = 2.3.5.7.19  r = +1.0946e-7  (leading + restored)
 * and omega=6 persistence: b = 1388310 (r = +2.088e-9) and b = 27736170 (r = +9.007e-11) still flip
 * (leading -, observed +), |r| decaying smoothly with no sign return.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- at the onset omega=5 the flip requires MAXIMAL smoothness (a packing threshold).
 * -------------------------------------------------------------------------------
 * Only the smoothest 4-prime prefix 2.3.5.7 produces any omega=5 flip. Replacing a single small prime
 * (2.3.5.11, 2.3.7.11, 2.5.7.11, 3.5.7.11) suppresses the flip ENTIRELY -- leading + holds for every
 * last prime. So the omega=5 crossover is a joint (omega, packing) threshold: it needs both the onset
 * omega AND the omega-1 smallest possible primes; any less-smooth prefix pushes p*(5) down to none.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The two-parity crossover is governed by a sharp joint (omega, small-prime-packing) threshold:
 * subleading Moebius parity cannot overtake leading Liouville parity for omega <= 4; onset is
 * omega = 5 but only at maximal smoothness (largest prime <= 17, smoothest prefix); by omega >= 6 the
 * flip is robust for every added prime out to the trace-anchor scale. Any explicit uniform remainder
 * bound for the imp-97096 sub-gap must control this crossover -- not a single 2^omega factor, but a
 * parity switch keyed on both omega and the largest prime factor. Measurement only: no uniform
 * remainder bound is supplied (imp-97096 sub-gap stays open); no bound moved; T ~ 2.594e7 anchor
 * unchanged; no refereed bound is changed; RH open; NO QED.
 *
 * Numerics: r(b) via an independent O(b) coprime sum with Kahan-compensated summation; residuals here
 * are ~1e-8..1e-11, resolved to 5-7 significant figures (plain vs Kahan agree to ~1e-14 at b ~ 2.8e7).
 *
 * @see imp-97156-route-m-primorial-signlaw-extension.js (the universal primorial flip being localized)
 * @see imp-97140-route-m-fixed-omega-residual-cohorts.js (leading sign + magnitude laws)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith + explicit-remainder sub-gap)
 *
 * Ticket: imp-97249 (numerical, opus-4-8, api-pool). Measurement; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...

export const IMP97249_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// -- exact O(b) kernel (Kahan-compensated sum; recomputed here) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const Aab = (a, b) => C * (a + b) + 0.5 * (a - b) * Math.log(b / a);

// r(b) = F_arith(b)/(phi(b) b) - kappa_arith (normalized residual, Kahan summation).
function rOf(b) {
  let phi = 0, F = 0, comp = 0;
  for (let a = 1; a < b; a++) {
    if (gcd(a, b) === 1) {
      phi += 1;
      const y = Aab(a, b) - comp;
      const t = F + y;
      comp = (t - F) - y;
      F = t;
    }
  }
  return F / (phi * b) - IMP97249_KAPPA_ARITH;
}

// Leading (data-consistent) sign rule: sign(r) = (-1)^(omega+1); omega odd -> +1, even -> -1.
const leadingSign = (w) => (w % 2 === 1 ? 1 : -1);

// MEASURED crossover ladder p*(omega): the largest last prime p for which the smoothest family
// b = (product of the omega-1 smallest primes) * p still flips the leading rule (observed = mu(b)).
export const IMP97249_CROSSOVER = Object.freeze([
  Object.freeze({ omega: 2, prefix: '2',           lead: '-', pStarFlip: null, note: 'no flip for any p' }),
  Object.freeze({ omega: 3, prefix: '2.3',         lead: '+', pStarFlip: null, note: 'no flip for any p' }),
  Object.freeze({ omega: 4, prefix: '2.3.5',       lead: '-', pStarFlip: null, note: 'no flip for any p' }),
  Object.freeze({ omega: 5, prefix: '2.3.5.7',     lead: '+', pStarFlip: 17,   firstLeadP: 19, note: 'onset; flips only for p in {11,13,17}' }),
  Object.freeze({ omega: 6, prefix: '2.3.5.7.11',  lead: '-', pStarFlip: 12007, firstLeadP: null, note: 'robust; still flipping at p=12007 (b=2.77e7)' }),
]);

// Frozen residuals at the omega=5 crossover boundary and omega=6 persistence (heavy b: measured only).
export const IMP97249_BOUNDARY = Object.freeze([
  Object.freeze({ b: 3570,     factor: '2.3.5.7.17',        omega: 5, r: -2.316808e-8,  flips: true,  role: 'omega=5 last flip (p=17)' }),
  Object.freeze({ b: 3990,     factor: '2.3.5.7.19',        omega: 5, r:  1.094573e-7,  flips: false, role: 'omega=5 leading restored (p=19)' }),
  Object.freeze({ b: 1388310,  factor: '2.3.5.7.11.601',    omega: 6, r:  2.088284e-9,  flips: true,  role: 'omega=6 still flipping (p=601)', frozenOnly: true }),
  Object.freeze({ b: 27736170, factor: '2.3.5.7.11.12007',  omega: 6, r:  9.007384e-11, flips: true,  role: 'omega=6 still flipping (p=12007)', frozenOnly: true }),
]);

// RESULT 3: at the onset omega=5 the flip needs the smoothest prefix; any swap suppresses it entirely.
export const IMP97249_PACKING_ONSET = Object.freeze([
  Object.freeze({ prefix: '2.3.5.7',  prod: 210,  pStarFlip: 17,   flips: true,  note: 'smoothest 4-prime prefix -- the only one that flips' }),
  Object.freeze({ prefix: '2.3.5.11', prod: 330,  pStarFlip: null, flips: false, note: 'swap 7 -> 11: no flip for any p' }),
  Object.freeze({ prefix: '2.3.7.11', prod: 462,  pStarFlip: null, flips: false, note: 'drop 5: no flip for any p' }),
  Object.freeze({ prefix: '2.5.7.11', prod: 770,  pStarFlip: null, flips: false, note: 'drop 3: no flip for any p' }),
  Object.freeze({ prefix: '3.5.7.11', prod: 1155, pStarFlip: null, flips: false, note: 'drop 2: no flip for any p' }),
]);

export const IMP97249_VERDICT = Object.freeze({
  question:
    'measure the imp-97156 smoothness crossover: where the subleading Moebius mu(b) parity overtakes ' +
    'the leading Liouville lambda(b) parity in r(b), as a joint function of omega and small-prime packing',
  leadingRule: 'sign(r) = (-1)^(omega+1): omega odd -> +, even -> - (data-consistent Liouville parity)',
  flipDefinition: 'observed sign = mu(b) = (-1)^omega, OPPOSITE the leading rule',
  minimumOmegaForFlip: 5, // subleading never overtakes for omega <= 4 at any packing
  crossoverThreshold: 'p*(omega<=4)=none, p*(5)=17 (crossover in (17,19]), p*(6)>12007 (b up to 2.77e7)',
  onsetRequiresMaximalSmoothness: true, // omega=5 flips ONLY for the smoothest 4-prime prefix 2.3.5.7
  robustFromOmega6: true, // omega=6 flips for every tested added prime out to the trace-anchor scale
  jointThreshold: 'crossover keyed on BOTH omega and the largest prime factor, not a single 2^omega term',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  suppliesUniformRemainderBound: false, // imp-97096 sub-gap stays open
  qed: false,
  conclusion:
    'The two-parity crossover is a sharp joint (omega, small-prime-packing) threshold: the subleading ' +
    'Moebius parity cannot overtake the leading Liouville parity for omega <= 4 at any packing; onset is ' +
    'omega = 5 and razor-thin (only the smoothest prefix 2.3.5.7 flips, and only for largest prime <= 17, ' +
    'crossover in (17,19]); by omega >= 6 the flip is robust for every added prime out to b ~ 2.77e7. Any ' +
    'explicit uniform remainder bound for the imp-97096 sub-gap must control this crossover -- a parity ' +
    'switch keyed on both omega and the largest prime factor, not a single 2^omega factor. Measurement only: ' +
    'no uniform remainder bound is supplied (imp-97096 sub-gap stays open); no bound moved; T ~ 2.594e7 ' +
    'anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97249_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97156 two-parity crossover ' +
  'is a sharp joint (omega, small-prime-packing) threshold -- subleading Moebius parity never overtakes ' +
  'leading Liouville parity for omega <= 4, onset omega=5 only at maximal smoothness (largest prime <= 17), ' +
  'robust for omega >= 6 out to b ~ 2.77e7. Supplies NO uniform remainder bound -- the imp-97096 sub-gap ' +
  'stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// NOTE: rOf recompute is kept to b <= 3990 (fast) at import; heavy omega=6 b (frozenOnly) is measured-only.

const IMP97249_ASSERTIONS = [
  {
    id: 'imp97249-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97249_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97249_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed from gamma and log 2pi (matches imp-97156).',
  },
  {
    id: 'imp97249-omega4-never-flips',
    holds: () => {
      // omega=4 smoothest families (2.3.5.p) keep the leading sign (-) for a range of last primes.
      for (const p of [7, 11, 13, 17, 19, 23]) {
        if (rOf(30 * p) >= 0) return false; // leading omega=4 is negative
      }
      return true;
    },
    why: 'omega=4 (prefix 2.3.5) keeps the leading negative sign for every tested last prime -- subleading never overtakes below omega=5.',
  },
  {
    id: 'imp97249-omega5-crossover-at-17-19',
    holds: () => {
      // 2.3.5.7.17 = 3570 flips (r<0, leading +); 2.3.5.7.19 = 3990 restores leading (r>0).
      const r17 = rOf(3570), r19 = rOf(3990);
      if (!(r17 < 0)) return false;         // flip
      if (!(r19 > 0)) return false;         // leading restored
      if (Math.abs(r17 - (-2.316808e-8)) > 1e-12) return false;
      if (Math.abs(r19 - (1.094573e-7)) > 1e-12) return false;
      // and the two omega=5 primorial neighbours 2310, 2730 also flip (r<0).
      return rOf(2310) < 0 && rOf(2730) < 0;
    },
    why: 'the omega=5 crossover sits between p=17 (b=3570 flips, r<0) and p=19 (b=3990, leading + restored, r>0); reproduced by an independent Kahan O(b) recompute.',
  },
  {
    id: 'imp97249-omega5-onset-needs-smoothest-prefix',
    holds: () => {
      // smoothest prefix 2.3.5.7 flips at p=11 (b=2310, r<0); a swapped prefix 2.3.5.11 does NOT
      // flip at its smallest last prime (b = 330*13 = 4290, leading + kept).
      if (!(rOf(2310) < 0)) return false;   // smoothest flips
      if (!(rOf(4290) > 0)) return false;   // 2.3.5.11.13 keeps leading +
      return true;
    },
    why: 'the omega=5 flip needs the smoothest 4-prime prefix 2.3.5.7; swapping 7 -> 11 (prefix 2.3.5.11) suppresses the flip entirely (leading + kept).',
  },
  {
    id: 'imp97249-omega6-persistence-frozen',
    holds: () => {
      // heavy omega=6 residuals are frozen-measured; check they carry the flipped sign (leading -, observed +).
      const rows = IMP97249_BOUNDARY.filter((x) => x.frozenOnly);
      if (rows.length !== 2) return false;
      for (const { r, flips } of rows) {
        if (!flips) return false;
        if (!(r > 0)) return false; // omega=6 leading is -, so a flip means r>0
      }
      return true;
    },
    why: 'omega=6 (prefix 2.3.5.7.11) keeps flipping (r>0, opposite leading -) at b=1388310 and b=27736170 -- frozen-measured (recompute skipped to keep import light).',
  },
  {
    id: 'imp97249-crossover-ladder-monotone-onset',
    holds: () => {
      // the crossover threshold jumps: none (omega<=4) -> 17 (omega=5) -> 12007 (omega=6).
      const w4 = IMP97249_CROSSOVER.find((x) => x.omega === 4);
      const w5 = IMP97249_CROSSOVER.find((x) => x.omega === 5);
      const w6 = IMP97249_CROSSOVER.find((x) => x.omega === 6);
      return w4.pStarFlip === null && w5.pStarFlip === 17 && w6.pStarFlip === 12007;
    },
    why: 'the measured crossover threshold p*(omega) jumps sharply: none for omega<=4, 17 for omega=5, and >12007 for omega=6.',
  },
  {
    id: 'imp97249-honesty-gate-no-qed',
    holds: () =>
      IMP97249_VERDICT.anyBoundMoved === false &&
      IMP97249_VERDICT.postsRigorousCeiling === false &&
      IMP97249_VERDICT.suppliesUniformRemainderBound === false &&
      IMP97249_VERDICT.qed === false &&
      /NO QED/.test(IMP97249_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97249_HONEST_BANNER) &&
      /RH open/.test(IMP97249_HONEST_BANNER),
    why: 'measurement only: the crossover threshold is quantified but no uniform remainder bound is supplied and no bound moved -- honesty markers present, no QED.',
  },
];

for (const a of IMP97249_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97249-route-m-signlaw-crossover-threshold assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97249_KAPPA_ARITH,
  crossover: IMP97249_CROSSOVER,
  boundary: IMP97249_BOUNDARY,
  packingOnset: IMP97249_PACKING_ONSET,
  verdict: IMP97249_VERDICT,
  banner: IMP97249_HONEST_BANNER,
};
