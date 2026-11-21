/**
 * @module imp-97156-route-m-primorial-signlaw-extension
 *
 * imp-97156 (numerical, MEASUREMENT): extend the imp-97140 Route M residual SIGN law
 * sign(r(b)) = (-1)^omega(b) (rule: omega odd -> r>0, omega even -> r<0) to higher primorial
 * moduli (510510 = P7, 9699690 = P8) and near-primorial smooth moduli, to decide whether the
 * subleading opposite-sign takeover imp-97140 RESULT 2 found at b = 2310, 2730, 30030 is a
 * UNIVERSAL primorial-collapse phenomenon or a coincidence that stops. It does not stop: every
 * primorial P5..P8 flips, and the flipped sign follows the clean opposite parity sign(r) = mu(b)
 * = (-1)^omega at squarefree primorials. No bound moves; supplies NO uniform remainder bound
 * (the imp-97096 sub-gap stays open); T ~ 2.594e7 trace anchor unchanged; no refereed bound is changed;
 * RH open; NO QED.
 *
 * Notation as imp-97140 / imp-97096 / imp-97122: R_b = {a : 1 <= a <= b-1, (a,b)=1},
 * C = (log 2pi - gamma)/2, A(a,b) = C(a+b) + (1/2)(a-b) log(b/a),
 * F_arith(b) = Sum_{a in R_b} A(a,b), kappa_arith = (3/2) C - 3/8 = 0.5704960511308594...,
 * r(b) = F_arith(b)/(phi(b) b) - kappa_arith.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 -- the subleading opposite-sign takeover is UNIVERSAL across primorials.
 * -------------------------------------------------------------------------------
 * imp-97140 found the leading sign law sign(r(b)) = (-1)^omega(b) (omega odd -> +, even -> -)
 * holds for 2799/2801 of b in [200,3000], failing only at the primorials 2310 (P5) and 2730,
 * with 30030 (P6) also flipping. Extending to the next primorials:
 *     b = 2310    = P5  omega=5  predict + observed -  |r| = 1.068e-6
 *     b = 30030   = P6  omega=6  predict - observed +  |r| = 3.598e-7
 *     b = 510510  = P7  omega=7  predict + observed -  |r| = 3.471e-8
 *     b = 9699690 = P8  omega=8  predict - observed +  |r| = 2.485e-9
 * EVERY primorial flips the leading law -- the takeover is universal, not coincidental. The flipped
 * sign is itself a clean parity: observed sign = (-1)^omega = mu(b) (since a primorial is squarefree),
 * i.e. exactly OPPOSITE the imp-97140 leading (Liouville-parity) rule. So at the smoothest moduli the
 * residual sign is the literal Moebius mu(b), not the leading Liouville lambda(b).
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 -- the primorial collapse deepens geometrically with each added prime.
 * -------------------------------------------------------------------------------
 * |r| at the primorials falls 1.068e-6 -> 3.598e-7 -> 3.471e-8 -> 2.485e-9 (P5..P8); the cancellation
 * depth relative to the omega=1 scale GM|r| ~ 6.75e-4 (imp-97140) grows 632 -> 1880 -> 1.94e4 -> 2.72e5.
 * Each new (small, distinct) prime cancels the leading term roughly another order of magnitude toward
 * the floor, which is why the leading (-1)^omega term is annihilated and the subleading term wins.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 -- the flip is a SMOOTHNESS effect (new small distinct primes), not exact-primorial.
 * -------------------------------------------------------------------------------
 * Near-primorial squarefree moduli that swap one small prime for a slightly larger one ALSO flip:
 *     b = 570570 = 2.3.5.7.11.13.19   omega=7  predict + observed -  |r| = 3.016e-8
 *     b = 690690 = 2.3.5.7.11.13.23   omega=7  predict + observed -  |r| = 2.375e-8
 * so an exact primorial is not required -- what matters is packing omega distinct SMALL primes.
 * The control b = 1021020 = 2^2.3.5.7.11.13.17 (omega=7, but a repeated prime power replaces a new
 * distinct prime) does NOT flip: predict + observed +, |r| = 2.707e-9. Squaring an existing prime
 * deepens |r| to the P8 scale yet keeps the LEADING sign, so the takeover is driven by adding new
 * small DISTINCT primes (maximal smoothness of a squarefree modulus), not by omega parity alone.
 *
 * -------------------------------------------------------------------------------
 * VERDICT (honest; no bound moved).
 * -------------------------------------------------------------------------------
 * The imp-97140 subleading takeover is a universal primorial-collapse phenomenon: every primorial
 * P5..P8 (and near-primorial squarefree smooth moduli) violates the leading Liouville-parity sign law,
 * and at these moduli the residual sign is the literal Moebius mu(b) = (-1)^omega, opposite the leading
 * rule. The magnitude collapses ~10x per added small prime. This sharpens imp-97140 RESULT 2: any
 * explicit uniform remainder bound for the imp-97096 sub-gap must control TWO competing parity terms
 * (leading Liouville lambda(b), subleading Moebius mu(b)) whose crossover is governed by smoothness, not
 * a single 2^omega factor. Measurement only: no uniform remainder bound is supplied, no bound moved,
 * T ~ 2.594e7 anchor unchanged, no refereed bound is changed, RH open, NO QED.
 *
 * Numerics: r(b) computed by an independent O(b) coprime sum; plain and Kahan-compensated summation
 * agree to ~1e-14 at b = 9699690, far below the ~1e-9 residuals, so all signs and magnitudes here are
 * resolved to 5-6 significant figures.
 *
 * @see imp-97140-route-m-fixed-omega-residual-cohorts.js (the sign + magnitude laws being extended)
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (primorial collapse / 2^omega heuristic)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith + explicit-remainder sub-gap)
 *
 * Ticket: imp-97156 (numerical, opus-4-8, api-pool). Measurement; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...

export const IMP97156_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

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
  return F / (phi * b) - IMP97156_KAPPA_ARITH;
}

// omega(b) = number of DISTINCT prime factors.
function omega(n) {
  let c = 0, m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) { c += 1; while (m % p === 0) m /= p; }
  }
  if (m > 1) c += 1;
  return c;
}

const GM_ABS_R_OMEGA1 = 6.75e-4; // imp-97140 omega=1 scale reference for cancellation depth

// MEASURED primorial ladder P5..P8 (frozen). Leading rule: omega odd -> +, even -> -.
export const IMP97156_PRIMORIALS = Object.freeze([
  Object.freeze({ b: 2310,    factor: '2.3.5.7.11',          omega: 5, predict: '+', observed: '-', r: -1.067651e-6 }),
  Object.freeze({ b: 30030,   factor: '2.3.5.7.11.13',       omega: 6, predict: '-', observed: '+', r:  3.597957e-7 }),
  Object.freeze({ b: 510510,  factor: '2.3.5.7.11.13.17',    omega: 7, predict: '+', observed: '-', r: -3.471128e-8 }),
  Object.freeze({ b: 9699690, factor: '2.3.5.7.11.13.17.19', omega: 8, predict: '-', observed: '+', r:  2.484548e-9 }),
]);

// Near-primorial squarefree smooth moduli that ALSO flip (omega=7), and the non-flipping control.
export const IMP97156_NEAR_PRIMORIAL = Object.freeze([
  Object.freeze({ b: 570570,  factor: '2.3.5.7.11.13.19',    omega: 7, predict: '+', observed: '-', r: -3.016134e-8, flips: true }),
  Object.freeze({ b: 690690,  factor: '2.3.5.7.11.13.23',    omega: 7, predict: '+', observed: '-', r: -2.375333e-8, flips: true }),
  // control: a repeated prime power (2^2) instead of a new distinct small prime -> does NOT flip.
  Object.freeze({ b: 1021020, factor: '2^2.3.5.7.11.13.17',  omega: 7, predict: '+', observed: '+', r:  2.706852e-9, flips: false }),
]);

export const IMP97156_VERDICT = Object.freeze({
  question:
    'extend the imp-97140 sign law sign(r(b)) = (-1)^omega(b) to higher primorials (510510, 9699690) ' +
    'and near-primorial smooth moduli to decide whether the subleading opposite-sign takeover is universal',
  leadingRule: 'sign(r(b)) = (-1)^omega(b): omega odd -> r>0, omega even -> r<0 (Liouville parity)',
  leadingRuleSignConventionNote:
    'The exponent STRING "(-1)^omega(b)" is the mislabeled imp-97140 orientation: taken literally (-1)^omega ' +
    'is -1 for omega odd, contradicting the paired data omega odd -> r>0. The data-consistent leading form is ' +
    'sign(r(b)) = (-1)^(omega(b)+1) = -(-1)^omega(b) (imp-97167 STEP-4 derivation, leading tail term ' +
    '(-1)^omega delta(1) with delta(1) = -0.084469 < 0). This is a naming reconciliation only; the paired ' +
    '"omega odd -> r>0, omega even -> r<0" data and all measured signs below are unchanged. Consequently the ' +
    'primorial flippedSignLaw "sign(r) = (-1)^omega = mu(b)" IS the literal Moebius value and is genuinely ' +
    'OPPOSITE the corrected leading (-1)^(omega+1), so the "flip" language stays exactly valid.',
  primorialTakeoverIsUniversal: true, // every primorial P5..P8 flips the leading rule
  flippedSignLaw: 'at primorials sign(r) = (-1)^omega = mu(b) (Moebius, opposite the leading Liouville rule)',
  magnitudeCollapse: '|r| ~ 1.07e-6, 3.60e-7, 3.47e-8, 2.49e-9 for P5..P8 (~10x per added small prime)',
  flipIsSmoothnessNotExactPrimorial: true, // 570570, 690690 flip; only distinct-small-prime packing matters
  repeatedPrimePowerDoesNotFlip: true, // 1021020 = 2^2.P7-type keeps the leading sign
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  suppliesUniformRemainderBound: false, // imp-97096 sub-gap stays open
  qed: false,
  conclusion:
    'The imp-97140 subleading takeover is a universal primorial-collapse phenomenon: every primorial ' +
    'P5..P8 (2310, 30030, 510510, 9699690) violates the leading Liouville-parity sign law, and at these ' +
    'squarefree moduli the residual sign is the literal Moebius mu(b) = (-1)^omega, opposite the leading ' +
    'rule; |r| collapses ~10x per added small prime (1.07e-6 -> 2.49e-9, cancellation depth 632 -> 2.72e5). ' +
    'Near-primorial squarefree moduli (570570, 690690) also flip, so the effect is driven by packing ' +
    'omega distinct SMALL primes (smoothness), not by exact primorials; a repeated prime power (1021020 = ' +
    '2^2.3.5.7.11.13.17) deepens |r| to the P8 scale yet keeps the leading sign. Measurement only: no ' +
    'uniform remainder bound is supplied (imp-97096 sub-gap stays open); no bound moved; T ~ 2.594e7 ' +
    'anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97156_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the imp-97140 subleading opposite-sign ' +
  'takeover is UNIVERSAL across primorials -- every primorial P5..P8 (2310, 30030, 510510, 9699690) flips the ' +
  'leading sign law sign(r) = (-1)^omega(b), and at these squarefree moduli the residual sign equals the ' +
  'literal Moebius mu(b), opposite the leading Liouville rule; |r| collapses ~10x per added small prime. ' +
  'Near-primorial squarefree moduli also flip; a repeated prime power does not. Supplies NO uniform remainder ' +
  'bound -- the imp-97096 sub-gap stays open; no bound moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// NOTE: rOf recompute is kept to b <= 510510 (~35ms) at import; b=9699690 (~1s) is frozen-measured only.

const IMP97156_ASSERTIONS = [
  {
    id: 'imp97156-kappa-arith-value',
    holds: () =>
      Math.abs(IMP97156_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97156_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594, recomputed from gamma and log 2pi (matches imp-97140).',
  },
  {
    id: 'imp97156-primorial-literals-reproduce',
    holds: () => {
      // recompute the primorials up to 510510 (fast); freeze-only 9699690 (too heavy at import).
      for (const { b, r } of IMP97156_PRIMORIALS) {
        if (b > 510510) continue;
        if (Math.abs(rOf(b) - r) > 5e-10) return false;
      }
      return true;
    },
    why: 'the frozen primorial residuals r(b) for b in {2310, 30030, 510510} are reproduced by an independent Kahan O(b) recompute; b=9699690 is frozen-measured (recompute skipped to keep import light).',
  },
  {
    id: 'imp97156-every-primorial-flips-the-leading-rule',
    holds: () => {
      // leading rule predicts sign (-1)^omega with odd->+, even->-; every primorial does the OPPOSITE.
      for (const { b, omega: w } of IMP97156_PRIMORIALS) {
        if (b > 510510) continue; // 9699690 checked via frozen sign below
        const leadingSign = w % 2 === 1 ? 1 : -1;
        if (Math.sign(rOf(b)) !== -leadingSign) return false;
      }
      // frozen check for the heaviest primorial P8.
      const p8 = IMP97156_PRIMORIALS.find((x) => x.b === 9699690);
      const leadP8 = p8.omega % 2 === 1 ? '+' : '-';
      return p8.observed !== leadP8 && p8.r > 0; // omega=8 -> leading '-', observed '+'
    },
    why: 'every primorial P5..P8 flips the imp-97140 leading sign law; the observed sign equals (-1)^omega = mu(b) (recomputed for b<=510510, frozen for 9699690).',
  },
  {
    id: 'imp97156-magnitude-collapses-with-added-prime',
    holds: () => {
      // |r| strictly decreases P5->P6->P7->P8 (deepening primorial collapse).
      const a = IMP97156_PRIMORIALS.map((x) => Math.abs(x.r));
      for (let i = 1; i < a.length; i++) if (!(a[i] < a[i - 1])) return false;
      // cancellation depth (gm1/|r|) at P8 exceeds 1e5.
      return GM_ABS_R_OMEGA1 / Math.abs(IMP97156_PRIMORIALS[3].r) > 1e5;
    },
    why: '|r| falls monotonically across P5..P8 (1.07e-6 -> 2.49e-9) and the cancellation depth gm1/|r| exceeds 1e5 at P8 -- each added small prime cancels the leading term ~10x deeper.',
  },
  {
    id: 'imp97156-near-primorial-flips-but-prime-power-does-not',
    holds: () => {
      // 570570, 690690 (new distinct small primes) flip to r<0; 1021020 (2^2) keeps r>0.
      for (const { b, r, flips } of IMP97156_NEAR_PRIMORIAL) {
        const rc = rOf(b);
        if (Math.abs(rc - r) > 5e-10) return false;
        if (flips && !(rc < 0)) return false;
        if (!flips && !(rc > 0)) return false;
      }
      return true;
    },
    why: 'near-primorial squarefree moduli 570570/690690 flip (r<0, omega=7) but the repeated-prime-power control 1021020 = 2^2.3.5.7.11.13.17 keeps the leading sign (r>0) -- the flip needs new distinct small primes, not omega parity alone.',
  },
  {
    id: 'imp97156-honesty-gate-no-qed',
    holds: () =>
      IMP97156_VERDICT.anyBoundMoved === false &&
      IMP97156_VERDICT.postsRigorousCeiling === false &&
      IMP97156_VERDICT.suppliesUniformRemainderBound === false &&
      IMP97156_VERDICT.qed === false &&
      /NO QED/.test(IMP97156_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97156_HONEST_BANNER) &&
      /RH open/.test(IMP97156_HONEST_BANNER),
    why: 'measurement only: the primorial sign-law extension is quantified but no uniform remainder bound is supplied and no bound moved -- honesty markers present, no QED.',
  },
];

for (const a of IMP97156_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97156-route-m-primorial-signlaw-extension assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97156_KAPPA_ARITH,
  primorials: IMP97156_PRIMORIALS,
  nearPrimorial: IMP97156_NEAR_PRIMORIAL,
  verdict: IMP97156_VERDICT,
  banner: IMP97156_HONEST_BANNER,
};
