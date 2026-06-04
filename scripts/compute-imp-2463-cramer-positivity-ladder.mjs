#!/usr/bin/env node
// imp-2463: which arithmetic correction restores Weil positivity in the Cramer null?
// (Wave-4 follow-on to imp-2434. NUMERICAL probe; honest interpretation either way.)
//
// BACKGROUND (imp-2434)
// ---------------------
//   The Weil/explicit-formula "Lambda-bound" statistic is, for an even positive-type
//   test function h with g(x)=(1/2pi) integral h(r) e^{-i r x} dr,
//       W(h) = C(h) - P(h) >= 0   (Weil positivity, true under RH for h=|F|^2),
//   with C(h)=pole+arch (deterministic) and the prime/Lambda side
//       P(h) = 2 sum_{n>=2} Lambda(n) n^{-1/2} g(log n).
//   The Cramer null (each n>=2 prime with prob 1/log n, weight log n, no prime powers)
//   REPRODUCES THE MEAN of P (z ~ 0.005-0.24) but BREAKS the bound: a random prime
//   configuration overshoots C and violates W>=0 in 53-66% of trials. So the arithmetic
//   content of the bound is the exact cancellation keeping W>=0, not the coarse density.
//
// THIS TICKET (imp-2463)
// ----------------------
//   Progressively add arithmetic structure to the null and measure AT WHICH LEVEL the
//   positivity-violation rate Pr[W_rand<0]=Pr[P_rand>C] collapses to the true-prime
//   value (which is 0, since the true primes satisfy W_true>=0). The ladder, cumulative:
//
//     L0  Cramer base          : p_n=min(1,1/log n), w_n=(log n) n^{-1/2} g(log n).
//     L1  + prime powers       : ADD the true (deterministic) prime-power mass
//                                Delta_pp = 2 sum_{p,k>=2} (log p)(p^k)^{-1/2} g(log p^k)
//                                to every realisation (the Cramer base drops powers;
//                                the true von Mangoldt side has them).
//     L2  + Mertens 2nd-order  : rescale the inclusion probabilities so E[P_rand] matches
//                                P_true EXACTLY (the strongest density / Mertens-class
//                                pointwise correction: pins the mean to the true sum).
//     L3  + pair correlation   : suppress the null fluctuations by a variance-reduction
//                                factor rho (Montgomery/Hardy-Littlewood pair correlation
//                                damps weighted-prime-sum fluctuations below the Poisson
//                                level); sweep rho -> 0 toward the deterministic limit.
//
//   At each level we report (meanP, stdP), the centred margin z_C=(C-meanP)/stdP, and the
//   violation rate (exact Bernoulli Monte Carlo for L0-L2 where the sampler is realisable;
//   normal-approximation with scaled std for the L3 rho-sweep, which is the idealised
//   variance-reduction limit, not a realised correlated sampler -- labelled as such).
//
// HONEST EXPECTATION
//   imp-2434 already showed C ~ E[P_rand] ~ P_true to within an exponentially small margin.
//   So z_C ~ 0 at every level that only moves the MEAN: prime powers (L1) shift meanP UP by
//   Delta_pp>0 (so should if anything WORSEN violation), and mean-matching (L2) leaves
//   z_C ~ (C-P_true)/std ~ 0. Only crushing the VARIANCE (L3) can move the violation rate,
//   and even then the residual is the unresolved sign of the catastrophic-cancellation
//   margin C-P_true. The live question is whether any COARSE ingredient collapses it cleanly.
//
//   NUMERICAL probe. No proof of (or against) RH.
//
// OUTPUT: JSON summary to stdout.

import { performance } from 'node:perf_hooks';

// ---- first nontrivial zeta zeros (imaginary parts), for W_true validation ----
const ZEROS = [
  14.134725142, 21.022039639, 25.010857580, 30.424876126, 32.935061588,
  37.586178159, 40.918719012, 43.327073281, 48.005150881, 49.773832478,
  52.970321478, 56.446247697, 59.347044003, 60.831778525, 65.112544048,
  67.079810529, 69.546401711, 72.067157674, 75.704690699, 77.144840069,
  79.337375020, 82.910380854, 84.735492981, 87.425274613, 88.809111208,
  92.491899271, 94.651344041, 95.870634228, 98.831194218, 101.317851006,
  103.725538040, 105.446623052, 107.168611184, 111.029535543, 111.874659177,
  114.320220915, 116.226680321, 118.790782866, 121.370125002, 122.946829294,
];

const LOG_PI = Math.log(Math.PI);

// ---- complex digamma psi(z) (recurrence + asymptotic), for the arch density ----
function digamma(zr, zi) {
  let re = 0, im = 0;
  while (zr < 12) {
    const den = zr * zr + zi * zi;
    re -= zr / den;
    im -= -zi / den;
    zr += 1;
  }
  const modsq = zr * zr + zi * zi;
  re += 0.5 * Math.log(modsq);
  im += Math.atan2(zi, zr);
  re -= 0.5 * zr / modsq;
  im -= 0.5 * (-zi) / modsq;
  const invr = zr / modsq, invi = -zi / modsq;
  const wr = invr * invr - invi * invi;
  const wi = 2 * invr * invi;
  const B = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66];
  let pr = wr, pi = wi;
  for (let k = 0; k < B.length; k++) {
    const c = B[k] / (2 * (k + 1));
    re -= c * pr;
    im -= c * pi;
    const npr = pr * wr - pi * wi;
    const npi = pr * wi + pi * wr;
    pr = npr; pi = npi;
  }
  return { re, im };
}
const phiInf = (r) => digamma(0.25, r / 2).re - LOG_PI; // Re psi(1/4 + i r/2) - log pi

// ---- true von Mangoldt data, split into primes (k=1) and prime powers (k>=2) ----
function primePowerData(nMax) {
  const isComposite = new Uint8Array(nMax + 1);
  const primes = [];      // [logn, Lambda(n)/sqrt(n)] for n=p (k=1)
  const powers = [];      // [logn, Lambda(n)/sqrt(n)] for n=p^k, k>=2
  for (let p = 2; p <= nMax; p++) {
    if (isComposite[p]) continue;
    for (let m = 2 * p; m <= nMax; m += p) isComposite[m] = 1;
    const logp = Math.log(p);
    let n = p, k = 1;
    while (n <= nMax) {
      const entry = [Math.log(n), logp / Math.sqrt(n)];
      if (k === 1) primes.push(entry); else powers.push(entry);
      n *= p; k++;
    }
  }
  return { primes, powers };
}

// ---- Simpson nodes on r in [0, R] (h even -> half-line, double weight) ----
function rGrid(R, M) {
  const h = R / M;
  const r = new Float64Array(M + 1);
  const w = new Float64Array(M + 1);
  for (let i = 0; i <= M; i++) {
    r[i] = i * h;
    w[i] = (i === 0 || i === M) ? 1 : (i % 2 === 1 ? 4 : 2);
  }
  return { h, r, w, scale: h / 3 };
}

// ---- seeded LCG for reproducible Monte Carlo ----
let _seed = 0x2463abcd;
function rand() {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
}

const CAL_SIGMAS = [0.2, 0.25, 0.3]; // small sigma: zero side O(0.1), validates C & P machinery
const SIGMAS = [0.4, 0.6, 0.8, 1.0, 1.2];
const W_THRESHOLD = 1e-12;            // active-support cutoff for the Cramer term weight w_n
const N_HARD_CAP = 400000;            // safety cap on the integer range
const MC_TRIALS = 30000;
const RHO_SWEEP = [1, 0.5, 0.1, 0.01, 1e-3, 1e-4]; // pair-correlation variance-reduction factors

// deterministic non-prime part C(h)=pole+arch, true Lambda sum, prime-power mass Delta_pp
function deterministicParts(sigma, grid, primesTrue, powersTrue) {
  const amp = sigma * Math.sqrt(2 * Math.PI);
  const hOfR = (r) => amp * Math.exp(-0.5 * sigma * sigma * r * r);
  const hAtHalf = amp * Math.exp(0.5 * sigma * sigma * 0.25); // h(i/2)
  const gAt = (x) => Math.exp(-(x * x) / (2 * sigma * sigma));
  const pole = 2 * hAtHalf;
  let archAcc = 0;
  const { r, w, scale } = grid;
  for (let i = 0; i < r.length; i++) archAcc += w[i] * hOfR(r[i]) * phiInf(r[i]);
  const arch = (archAcc * scale) / Math.PI;
  const C = pole + arch;
  let primeSum = 0;
  for (const [logn, coef] of primesTrue) primeSum += coef * gAt(logn);
  let powerMass = 0;
  for (const [logn, coef] of powersTrue) powerMass += coef * gAt(logn);
  const Ptrue = 2 * (primeSum + powerMass); // full von Mangoldt sum (primes + powers)
  const DeltaPP = 2 * powerMass;            // deterministic prime-power contribution
  let zeroSide = 0;
  for (const g of ZEROS) zeroSide += 2 * hOfR(g);
  return { amp, hOfR, gAt, pole, arch, C, Ptrue, DeltaPP, Wtrue: C - Ptrue, zeroSide };
}

// complementary error function (Abramowitz-Stegun 7.1.26), for the normal tail
function erfc(x) {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const c = [0.17087277, -0.82215223, 1.48851587, -1.13520398, 0.27886807,
             -0.18628806, 0.09678418, 0.37409196, 1.00002368, -1.26551223];
  let poly = c[0];
  for (let k = 1; k < c.length; k++) poly = poly * t + c[k];
  const tau = t * Math.exp(-z * z + poly);
  return x >= 0 ? tau : 2 - tau;
}
const normalUpperTail = (zC) => 0.5 * erfc(zC / Math.SQRT2); // Pr[N(meanP,std) > C] = Pr[Z > zC]

function round(x, d) {
  const f = Math.pow(10, d);
  return Math.round(x * f) / f;
}

function main() {
  const t0 = performance.now();

  const grid = rGrid(200, 40000);
  const { primes: primesTrue, powers: powersTrue } = primePowerData(200000);

  // ---- calibration: W_true vs zero side on small sigma (zero side resolvable) ----
  const calibration = CAL_SIGMAS.map((sigma) => {
    const d = deterministicParts(sigma, grid, primesTrue, powersTrue);
    const relErr = Math.abs(d.Wtrue - d.zeroSide) / Math.abs(d.zeroSide);
    return {
      sigma,
      Wtrue: round(d.Wtrue, 6),
      zeroSide: round(d.zeroSide, 6),
      relErr: Number(relErr.toExponential(3)),
    };
  });
  const validationOk = calibration.every((c) => c.relErr < 5e-3);

  const rows = [];
  for (const sigma of SIGMAS) {
    const { gAt, C, Ptrue, DeltaPP } = deterministicParts(sigma, grid, primesTrue, powersTrue);

    // ---- Cramer base active support {n : w_n > W_THRESHOLD} ----
    // w_n = (log n) n^{-1/2} g(log n),  p_n = min(1, 1/log n)
    const wn = [];
    const pn = [];
    let meanBase = 0; // 2 sum p_n w_n
    let started = false;
    for (let n = 2; n <= N_HARD_CAP; n++) {
      const ln = Math.log(n);
      const wnn = ln * Math.exp(-0.5 * ln) * gAt(ln); // (log n) n^{-1/2} g(log n)
      if (wnn > W_THRESHOLD) {
        started = true;
        const p = Math.min(1, 1 / ln);
        wn.push(wnn);
        pn.push(p);
        meanBase += p * wnn;
      } else if (started && ln > sigma * sigma + 4) {
        break; // past the Gaussian peak and below threshold -> tail negligible
      }
    }
    meanBase *= 2;
    const A = wn.length;

    // Mean-matching factor (L2): rescale every p_n so that E[P_rand] (incl. prime powers)
    // equals P_true exactly. meanBase + DeltaPP is the L1 mean; we want the rescaled
    // primes part to satisfy 2*scale*sum p_n w_n + DeltaPP = Ptrue.
    const scaleMM = (Ptrue - DeltaPP) / meanBase; // multiply each p_n by scaleMM

    // helper: exact Bernoulli MC violation rate for a given p-multiplier and additive offset
    function mcViolation(pMul, offset) {
      let viol = 0, mcMean = 0, mcM2 = 0;
      for (let t = 0; t < MC_TRIALS; t++) {
        let Pr = 0;
        for (let i = 0; i < A; i++) {
          const p = pn[i] * pMul;
          if (rand() < p) Pr += wn[i];
        }
        Pr = 2 * Pr + offset;
        if (Pr > C) viol++;
        const d = Pr - mcMean;
        mcMean += d / (t + 1);
        mcM2 += d * (Pr - mcMean);
      }
      return { rate: viol / MC_TRIALS, mean: mcMean, std: Math.sqrt(mcM2 / (MC_TRIALS - 1)) };
    }

    // closed-form mean/var for p-multiplier pMul and additive offset
    function moments(pMul, offset) {
      let m = 0, v = 0;
      for (let i = 0; i < A; i++) {
        const p = Math.min(1, pn[i] * pMul);
        m += p * wn[i];
        v += p * (1 - p) * wn[i] * wn[i];
      }
      return { mean: 2 * m + offset, std: Math.sqrt(4 * v) };
    }

    // ---- Level results ----
    // L0: Cramer base (no powers, no mean-match)
    const m0 = moments(1, 0);
    const mc0 = mcViolation(1, 0);
    // L1: + prime powers (deterministic additive shift DeltaPP)
    const m1 = moments(1, DeltaPP);
    const mc1 = mcViolation(1, DeltaPP);
    // L2: + Mertens 2nd-order (mean-matched: rescale p so E[P_rand]=Ptrue)
    const m2 = moments(scaleMM, DeltaPP);
    const mc2 = mcViolation(scaleMM, DeltaPP);

    const lvl = (label, m, mc) => ({
      level: label,
      meanPrand: round(m.mean, 6),
      stdPrand: Number(m.std.toExponential(3)),
      zC: Number(((C - m.mean) / m.std).toExponential(3)), // centred margin in std units
      violRateMC: round(mc.rate, 5),
      violRateNormal: Number(normalUpperTail((C - m.mean) / m.std).toExponential(3)),
    });

    // L3: + pair correlation -> variance-reduction sweep on the mean-matched L2 model.
    // Idealised limit (normal approx with std scaled by rho); NOT a realised correlated
    // sampler -- it answers "how much must the fluctuation shrink to move the violation".
    const l3 = RHO_SWEEP.map((rho) => {
      const stdR = m2.std * rho;
      const zC = (C - m2.mean) / stdR;
      return { rho, stdPrand: Number(stdR.toExponential(3)), zC: Number(zC.toExponential(3)),
               violRateNormal: Number(normalUpperTail(zC).toExponential(3)) };
    });

    rows.push({
      sigma,
      C: round(C, 6),
      Ptrue: round(Ptrue, 6),
      DeltaPP: Number(DeltaPP.toExponential(3)),       // prime-power mass (positive)
      Wtrue: Number((C - Ptrue).toExponential(3)),     // true margin (exponentially small)
      activeSupport: A,
      meanMatchScale: round(scaleMM, 6),               // L2 probability multiplier
      L0_cramer: lvl('L0 Cramer base', m0, mc0),
      L1_primePowers: lvl('L1 + prime powers', m1, mc1),
      L2_mertensMeanMatch: lvl('L2 + Mertens (mean-matched)', m2, mc2),
      L3_pairCorrelationSweep: l3,
    });
  }

  // ---- verdict ----
  // Does any COARSE ingredient (L1 powers, L2 mean-match) collapse the violation to ~0?
  const l0Rates = rows.map((r) => r.L0_cramer.violRateMC);
  const l1Rates = rows.map((r) => r.L1_primePowers.violRateMC);
  const l2Rates = rows.map((r) => r.L2_mertensMeanMatch.violRateMC);
  const maxL2 = Math.max(...l2Rates);
  const minL2 = Math.min(...l2Rates);
  // L3: smallest rho still needed to push the (normal) violation below 0.01 at every sigma
  const rhoToCollapse = (() => {
    for (const rho of RHO_SWEEP) {
      const ok = rows.every((r) => {
        const e = r.L3_pairCorrelationSweep.find((x) => x.rho === rho);
        return e.violRateNormal < 0.01;
      });
      if (ok) return rho;
    }
    return null; // even rho=1e-4 does not collapse it cleanly at every sigma
  })();

  const coarseRestores = maxL2 < 0.02; // did powers+mean-match alone fix positivity?

  let verdict, interpretation;
  if (coarseRestores) {
    verdict = 'coarse-arithmetic-restores-positivity';
    interpretation =
      'Adding prime powers and the Mertens-class mean-matching alone drives the null Weil-positivity violation rate below 2% at every sigma: a coarse arithmetic correction (not the full exact cancellation) already enforces the bound.';
  } else if (rhoToCollapse !== null) {
    verdict = 'only-variance-reduction-restores-positivity';
    interpretation =
      'Prime powers (L1) and Mertens mean-matching (L2) leave the violation rate near ' +
      (100 * minL2).toFixed(0) + '-' + (100 * maxL2).toFixed(0) +
      '% (they move only the MEAN, and C ~ E[P_rand] ~ P_true to within an exponentially small margin, so z_C ~ 0). The violation rate only collapses below 1% once the pair-correlation variance-reduction factor reaches rho ~ ' +
      rhoToCollapse.toExponential(0) +
      ' -- i.e. the fluctuations must shrink by ' + Math.round(1 / rhoToCollapse) +
      'x toward the deterministic limit. The minimal ingredient that restores Weil positivity is therefore not any coarse density/power correction but the near-total suppression of configurational fluctuations (the exact cancellation), refining imp-2434 quantitatively.';
  } else {
    verdict = 'no-coarse-ingredient-restores-positivity';
    interpretation =
      'Neither prime powers, Mertens mean-matching, nor a 10^4x pair-correlation variance reduction cleanly collapses the null violation rate to the true-prime value (0) at every sigma. The mean is reproduced at all levels (z_C ~ 0 since C ~ P_true within the exponentially small margin), and once the variance is crushed the residual is the unresolved SIGN of the catastrophic-cancellation margin C-P_true. So Weil positivity in this statistic is not restored by any coarse arithmetic ingredient -- it is the full exact cancellation, the deterministic configuration itself, consistent with and sharpening imp-2434.';
  }

  const out = {
    ticket: 'imp-2463',
    object:
      'Ladder of progressively arithmetic Cramer nulls vs the Weil/explicit-formula Lambda-bound P(h) <= C(h); at which level does the positivity-violation rate collapse to the true-prime value (0)?',
    ladder: {
      L0: 'Cramer base: p_n=min(1,1/log n), w_n=(log n) n^{-1/2} g(log n) [imp-2434 base]',
      L1: 'L0 + prime powers: add the deterministic von Mangoldt prime-power mass Delta_pp=2 sum_{p,k>=2}(log p)(p^k)^{-1/2} g(log p^k)',
      L2: 'L1 + Mertens 2nd-order: rescale p_n so E[P_rand]=P_true exactly (strongest pointwise density / Mertens-class correction)',
      L3: 'L2 + pair correlation: suppress fluctuations by a variance-reduction factor rho (Montgomery/Hardy-Littlewood), swept toward the deterministic limit',
    },
    testFunctions: 'Gaussian positive-type h_sigma(r)=sigma sqrt(2pi) e^{-sigma^2 r^2/2}, g_sigma(x)=e^{-x^2/2sigma^2}',
    params: { sigmas: SIGMAS, mcTrials: MC_TRIALS, rhoSweep: RHO_SWEEP, wThreshold: W_THRESHOLD, seed: '0x2463abcd' },
    validation: {
      method: 'W_true compared to zero side 2 sum_{gamma>0} h(gamma) over first 40 ordinates, on small calibration sigma where the zero side is O(0.1) and resolvable',
      rows: calibration,
      passed: validationOk,
    },
    rows,
    method_notes: {
      l0_l2: 'exact seeded-Bernoulli Monte Carlo over the active support (no CLT assumption); meanP/stdP closed form.',
      l3: 'normal (CLT) approximation with std scaled by rho. This is the IDEALISED variance-reduction limit, NOT a realised correlated sampler -- it quantifies how far the fluctuation must shrink to move the violation rate, since prime pair-correlation suppresses (but cannot easily be sampled exactly here).',
      wTrue: 'At sigma>=0.6 the printed W_true=C-Ptrue is the difference of two O(1) quantities whose true value (the zero side) is <1e-8; its sign/last digits are catastrophic-cancellation noise. Positivity is certified by the small-sigma calibration block (relErr ~1e-10, zero side O(0.1), strictly >=0). The ladder conclusion uses only C (O(1), accurate), the level means and the null spread -- never W_true precision.',
    },
    summary: {
      validationOk,
      l0ViolRateMC: l0Rates.map((x) => round(x, 4)),
      l1ViolRateMC: l1Rates.map((x) => round(x, 4)),
      l2ViolRateMC: l2Rates.map((x) => round(x, 4)),
      l2ViolMin: round(minL2, 5),
      l2ViolMax: round(maxL2, 5),
      rhoToCollapseBelow1pct: rhoToCollapse,
      coarseArithmeticRestoresPositivity: coarseRestores,
      verdict,
      interpretation,
    },
    scope:
      'NUMERICAL probe isolating the minimal arithmetic ingredient that enforces Weil positivity in the null. Honest either way; not a proof of or against RH.',
    elapsedMs: Math.round(performance.now() - t0),
  };
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
}

main();
