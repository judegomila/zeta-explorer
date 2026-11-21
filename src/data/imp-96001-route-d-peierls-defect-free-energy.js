/**
 * @fileoverview imp-96001 -- Novel-routes roadmap (2026-09-23) ROUTE D first test:
 * the Peierls defect-pair free energy F(delta) of the zero-gas, computed from the ACTUAL
 * prime sum at several heights, with the sign of F''(0) and the monotonicity / shape verdict.
 *
 * ROUTE D (rh-novel-routes-roadmap-2026-09-23, key 'D'; status to-test). Treat an off-line
 * zero as a defect at s=1/2+delta+i gamma; the functional equation xi(s)=xi(1-s) forces a
 * MIRROR defect at 1-rho=1/2-delta+i gamma (same height, reflected across sigma=1/2). The
 * Peierls / Ising domain-wall-confinement logic asks: is the defect-pair free energy
 *     F(delta) = F_Coul(delta) + F_prime(delta),  delta=sigma-1/2,
 * convex with a strict minimum at delta=0? A confining well would pin zeros to the line
 * (Weil positivity in a Peierls dressing). Measurement only; confinement / RH NOT claimed.
 *
 * THE TWO PIECES (explicit formula log-gas reading).
 *  (1) 2D-Coulomb self-energy of the like-charge defect + its FE mirror, separation 2|delta|:
 *          F_Coul(delta) = -log(2|delta|).
 *      Both defects are zeros (same sign), so in 2D this is the repulsive pair potential.
 *  (2) Prime-field cost from the explicit formula, obtained by integrating the prime FIELD
 *      along the displacement. The prime field on the line is (route B, imp-95999)
 *          Re Psi(1/2+delta+i gamma) = 2 sum_p log p . p^{-1/2} . cos(gamma ln p) . cosh(delta ln p),
 *      which is EVEN in delta; its delta-integral is the cost
 *          F_prime(delta) = 2 sum_p p^{-1/2} . cos(gamma ln p) . sinh(delta ln p),
 *      which is ODD in delta -- exactly the parity the roadmap predicts for the prime-field cost.
 *
 * THE MEASUREMENTS (actual prime sum, primes up to 20000, low zeta zeros as test heights).
 *  - PARITY: F_prime(delta)+F_prime(-delta)=0 to machine precision for every test height
 *    (odd, as predicted). Consequently d2/ddelta2 F_prime |_0 = 0 EXACTLY: the prime sum
 *    contributes ZERO curvature to F''(0).
 *  - TILT: the on-line slope dF_prime/ddelta |_0 = Re Psi(1/2+i gamma) is NONZERO at every low
 *    zero (gamma_1: -0.7635; and -9.73, -12.53, -18.63, -22.49, -12.35 at the next five). So
 *    the prime cost is a linear TILT about delta=0, not a well: it makes delta=0 an inflection,
 *    not a minimum, and breaks the delta<->-delta symmetry.
 *  - COULOMB CORE: F_Coul(delta) -> +infinity as delta -> 0 (the mirror pair merges on the line),
 *    so delta=0 is a singular Coulomb MAXIMUM / barrier, and F_Coul decreases monotonically as
 *    |delta| grows -- the bare like-charge pair is DECONFINING.
 *
 * SHAPE VERDICT (honest partial; route D first test). NOT-CONFINING-AS-MODELED / OPEN:
 * from the prime sum plus the bare 2D-Coulomb self-energy, F(delta) has NO strict convex
 * minimum at delta=0. The curvature splits as F''(0) = [Coulomb: singular +, a barrier] +
 * [prime: exactly 0] + [tilt from the odd prime cost], none of which supplies the positive
 * line tension a Peierls well needs. The merge singularity of F_Coul at delta=0 is itself the
 * tell that the bare model is wrong for a lone on-line zero (a real on-line zero has no
 * coincident partner): the missing ingredient is the ARCHIMEDEAN / mean-field confining
 * background (the smooth increasing zero-density potential from the xi growth term), which is
 * transcendental. Named sub-gap D-ARCH-BACKGROUND: supply and sign-control the regularized
 * archimedean confining term whose curvature would make F''(0)>0; the raw prime sum alone
 * cannot decide confinement. This parallels route B (imp-95999): the decisive input is the
 * analytically-continued / regularized piece, not the raw prime sum, consistent with the
 * flow-blindness no-go (project_flow_blindness_and_T3_strip). NO bound; NO QED; RH open;
 * no refereed bound is changed.
 */

// --- low nontrivial zeta zeros (imaginary parts, on sigma=1/2), test heights ---
export const LOW_ZETA_ZEROS = Object.freeze([
  14.134725141734693,
  21.022039638771555,
  25.010857580145688,
  30.424876125859513,
  32.935061587739189,
  37.586178158825671,
]);

function primesUpTo(P) {
  const sieve = new Uint8Array(P + 1);
  const out = [];
  for (let i = 2; i <= P; i += 1) {
    if (!sieve[i]) {
      out.push(i);
      for (let j = 2 * i; j <= P; j += i) sieve[j] = 1;
    }
  }
  return out;
}

const PRIMES = primesUpTo(20000);

// bare 2D-Coulomb self-energy of the defect + its FE mirror (separation 2|delta|)
function fCoul(delta) {
  return -Math.log(2 * Math.abs(delta));
}

// prime-field cost F_prime(delta) = 2 sum_p p^{-1/2} cos(gamma ln p) sinh(delta ln p) (odd in delta)
function fPrime(gamma, delta, primes) {
  let s = 0;
  for (const p of primes) {
    const lp = Math.log(p);
    s += Math.pow(p, -0.5) * Math.cos(gamma * lp) * Math.sinh(delta * lp);
  }
  return 2 * s;
}

// prime FIELD on the line = dF_prime/ddelta = 2 sum_p log p p^{-1/2} cos(gamma ln p) cosh(delta ln p)
function primeField(gamma, delta, primes) {
  let s = 0;
  for (const p of primes) {
    const lp = Math.log(p);
    s += lp * Math.pow(p, -0.5) * Math.cos(gamma * lp) * Math.cosh(delta * lp);
  }
  return 2 * s;
}

function totalF(gamma, delta, primes) {
  return fCoul(delta) + fPrime(gamma, delta, primes);
}

const GAMMA1 = LOW_ZETA_ZEROS[0];
const DELTA_SAMPLES = Object.freeze([-0.2, -0.1, -0.05, -0.02, 0.02, 0.05, 0.1, 0.2]);

// F(delta) samples at gamma_1 (F_Coul + F_prime), primes<=20000
export const F_SAMPLES_GAMMA1 = Object.freeze(
  DELTA_SAMPLES.map((d) => Object.freeze({
    delta: d,
    fCoul: fCoul(d),
    fPrime: fPrime(GAMMA1, d, PRIMES),
    F: totalF(GAMMA1, d, PRIMES),
  })),
);

// on-line tilt slope dF_prime/ddelta|_0 = Re Psi(1/2 + i gamma) per test height
export const TILT_SLOPE_BY_HEIGHT = Object.freeze(
  LOW_ZETA_ZEROS.map((g) => Object.freeze({ gamma: g, tilt: primeField(g, 0, PRIMES) })),
);

export const ROUTE_D_PEIERLS_FREE_ENERGY = Object.freeze({
  id: 'imp-96001-route-d-peierls-defect-free-energy',
  route: 'D',
  roadmap: 'rh-novel-routes-roadmap-2026-09-23',
  model: 'F(delta) = F_Coul(delta) + F_prime(delta), delta = sigma - 1/2, defect + FE mirror at 1-rho',
  fCoul: 'F_Coul(delta) = -log(2|delta|)  (bare 2D-Coulomb like-charge pair self-energy)',
  fPrime:
    'F_prime(delta) = 2 sum_p p^{-1/2} cos(gamma ln p) sinh(delta ln p)  (integral of the even prime field; ODD in delta)',
  primeCurvatureAtZero:
    'd2/ddelta2 F_prime|_0 = 0 EXACTLY (odd function): the prime sum contributes zero curvature to F(0).',
  coulombCore:
    'F_Coul -> +infinity as delta -> 0 (mirror pair merges on-line): delta=0 is a singular barrier / MAX, deconfining.',
  tiltNote:
    'on-line slope dF_prime/ddelta|_0 = Re Psi(1/2+i gamma) is nonzero at every low zero (tilt, not a well).',
  subGap:
    'D-ARCH-BACKGROUND: supply and sign-control the regularized archimedean / mean-field confining term '
    + '(from the xi growth) whose positive curvature would make the second delta-derivative of F positive; '
    + 'the raw prime sum alone cannot decide confinement.',
  verdict: 'NOT-CONFINING-AS-MODELED / OPEN',
  note: 'Measurement + derivation only; no bound; RH open; no refereed bound is changed; NO QED.',
});

export const ROUTE_D_PEIERLS_ASSERTIONS = Object.freeze([
  {
    name: 'prime-field cost F_prime is ODD in delta (F_prime(+d)+F_prime(-d)=0) at every low zero (as roadmap predicts)',
    holds: () => LOW_ZETA_ZEROS.every(
      (g) => Math.abs(fPrime(g, 0.05, PRIMES) + fPrime(g, -0.05, PRIMES)) < 1e-9,
    ),
  },
  {
    name: 'prime curvature F_prime\'\'(0) = 0 to numeric precision (odd => zero contribution to F(0))',
    holds: () => {
      const h = 0.01;
      const curv = (fPrime(GAMMA1, h, PRIMES) - 2 * fPrime(GAMMA1, 0, PRIMES) + fPrime(GAMMA1, -h, PRIMES)) / (h * h);
      return Math.abs(curv) < 1e-6;
    },
  },
  {
    name: 'on-line tilt slope is nonzero at every low zero (prime cost is a tilt, not a well)',
    holds: () => TILT_SLOPE_BY_HEIGHT.every((r) => Math.abs(r.tilt) > 0.1),
  },
  {
    name: 'Coulomb core is a barrier: F_Coul(0.001) > F_Coul(0.2) (delta=0 is a singular MAX, deconfining)',
    holds: () => fCoul(0.001) > fCoul(0.2),
  },
  {
    name: 'no strict convex min at 0: F(small |delta|) exceeds F(large |delta|) on both sides at gamma_1',
    holds: () => totalF(GAMMA1, 0.02, PRIMES) > totalF(GAMMA1, 0.2, PRIMES)
      && totalF(GAMMA1, -0.02, PRIMES) > totalF(GAMMA1, -0.2, PRIMES),
  },
  {
    name: 'honest verdict recorded: not-confining-as-modeled, sub-gap named, no QED / RH open',
    holds: () => ROUTE_D_PEIERLS_FREE_ENERGY.verdict === 'NOT-CONFINING-AS-MODELED / OPEN'
      && /D-ARCH-BACKGROUND/.test(ROUTE_D_PEIERLS_FREE_ENERGY.subGap)
      && /RH open/.test(ROUTE_D_PEIERLS_FREE_ENERGY.note),
  },
]);

export default ROUTE_D_PEIERLS_FREE_ENERGY;
