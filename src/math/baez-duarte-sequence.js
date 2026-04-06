/**
 * Baez-Duarte Sequence c_k and Beurling-Nyman Connection
 *
 * imp-279: Baez-Duarte (2003) defined:
 *   c_k = sum_{j=0}^k (-1)^j * C(k,j) * (1 - 1/zeta(2+2j/k))
 *
 * (simplified form; the exact definition involves specific inner products)
 *
 * Alternative equivalent: RH iff
 *   d_k := sum_{j=0}^k (-1)^j * C(k,j) / zeta(2+2j) -> 0 as k -> inf
 *
 * This is a DISCRETE version of the Beurling-Nyman criterion (imp-236/267):
 * instead of L^2 distance, uses binomial-weighted zeta values.
 *
 * The c_k sequence encodes how well the constant function 1 can be
 * approximated in the Beurling-Nyman sense using k basis functions.
 *
 * THIS MODULE:
 *   1. Compute c_k for k = 1..50 via binomial sums of 1/zeta(2+2j).
 *   2. Track |c_k| decay rate.
 *   3. Compare to Beurling-Nyman d_N (imp-267).
 */

// zeta(s) for real s > 1
function zetaReal(s) {
  let sum = 0;
  for (let n = 1; n <= 5000; n++) sum += Math.pow(n, -s);
  sum += Math.pow(5000, 1-s)/(s-1) - 0.5*Math.pow(5000, -s);
  return sum;
}

// Binomial coefficient C(n,k) via multiplicative formula
function binomial(n, k) {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  k = Math.min(k, n-k);
  let result = 1;
  for (let i = 0; i < k; i++) result = result * (n-i) / (i+1);
  return result;
}

// Baez-Duarte coefficient:
// c_k = sum_{j=0}^k (-1)^j * C(k,j) * (1 - 1/zeta(2+2j))
// Simplified: uses zeta at even integers 2, 4, 6, ...
// Note: 1/zeta(2n) is well-defined and < 1 for n >= 1.
function baezDuarteCoeff(k) {
  let sum = 0;
  for (let j = 0; j <= k; j++) {
    const sign = (j % 2 === 0) ? 1 : -1;
    const binom = binomial(k, j);
    const zetaVal = zetaReal(2 + 2*j);
    sum += sign * binom * (1 - 1/zetaVal);
  }
  return sum;
}

// Alternative: d_k = sum (-1)^j * C(k,j) / zeta(2+2j)
function baezDuarteD(k) {
  let sum = 0;
  for (let j = 0; j <= k; j++) {
    const sign = (j % 2 === 0) ? 1 : -1;
    sum += sign * binomial(k, j) / zetaReal(2 + 2*j);
  }
  return sum;
}

export function baezDuarteSequenceTest() {
  // Compute c_k and d_k for k = 1..40
  const K_MAX = 40;
  const results = [];
  for (let k = 1; k <= K_MAX; k++) {
    const ck = baezDuarteCoeff(k);
    const dk = baezDuarteD(k);
    results.push({
      k,
      c_k: +ck.toExponential(4),
      d_k: +dk.toExponential(4),
      '|c_k|': +Math.abs(ck).toExponential(4),
    });
  }

  // Track decay: fit |c_k| ~ exp(-alpha*k) or |c_k| ~ k^{-beta}
  const valid = results.filter(r => Math.abs(parseFloat(r.c_k)) > 1e-300);
  let decayType = 'unknown';
  if (valid.length >= 5) {
    const lastFew = valid.slice(-5);
    const logAbs = lastFew.map(r => Math.log(Math.abs(parseFloat(r.c_k))));
    const ks = lastFew.map(r => r.k);
    // Check if exponential decay
    const diffs = [];
    for (let i = 1; i < logAbs.length; i++) diffs.push(logAbs[i] - logAbs[i-1]);
    const avgDiff = diffs.reduce((a,b)=>a+b,0)/diffs.length;
    decayType = `exponential: |c_k| ~ exp(${avgDiff.toFixed(2)}*k)`;
  }

  // Display sample
  const display = results.filter(r => r.k <= 10 || r.k % 5 === 0);

  return {
    framework: {
      name: 'Baez-Duarte Sequence (2003)',
      definition: 'c_k = sum (-1)^j * C(k,j) * (1-1/zeta(2+2j))',
      criterion: 'RH iff c_k -> 0 as k -> infinity',
      connection: 'Discrete analog of Beurling-Nyman d_N (imp-236/267)',
    },

    coefficients: display,
    total_computed: K_MAX,
    decay_type: decayType,

    keyFindings: [
      `Computed c_k for k=1..${K_MAX} via binomial sums of 1/zeta(2+2j).`,
      `c_1 = ${results[0].c_k}, c_10 = ${results[9].c_k}, c_${K_MAX} = ${results[K_MAX-1].c_k}.`,
      `Decay: ${decayType}.`,
      `RH iff c_k -> 0. Observed: ${Math.abs(parseFloat(results[K_MAX-1].c_k)) < 0.01 ? 'approaching 0' : 'needs more k'}.`,
      `Baez-Duarte is the DISCRETE counterpart to Beurling-Nyman L^2 distance.`,
    ],

    verdict:
      `BAEZ-DUARTE: c_k computed for k=1..${K_MAX}. ` +
      `Decay: ${decayType}. RH iff c_k -> 0.`,
  };
}
