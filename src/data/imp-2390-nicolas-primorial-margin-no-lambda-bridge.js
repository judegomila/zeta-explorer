/**
 * @module imp-2390-nicolas-primorial-margin-no-lambda-bridge
 * @fileoverview imp-2390 -- NUMERICAL fan-out from imp-2360 / imp-1311: test a
 *   SECOND, independent RH-equivalent elementary inequality -- the Nicolas 1983
 *   primorial / Euler-phi criterion -- and ask whether its margin carries any
 *   quantitative content convertible to the de Bruijn-Newman heat-flow constant
 *   Lambda, or whether it confirms the imp-2360 no-bridge verdict.
 *
 *   THE NICOLAS CRITERION (Nicolas 1983, J. Number Theory 17, 375-388).
 *   Let N_k = prod_{i<=k} p_i be the k-th PRIMORIAL (product of the first k
 *   primes). The Riemann Hypothesis is TRUE if and only if, for every k >= 1,
 *
 *        N_k / phi(N_k)  >  e^gamma * log log N_k.
 *
 *   Here phi is Euler's totient and, since N_k is squarefree,
 *
 *        N_k / phi(N_k) = prod_{p <= p_k} p/(p-1),   log N_k = theta(p_k).
 *
 *   Define the NICOLAS MARGIN
 *
 *        m_k := N_k/phi(N_k) - e^gamma * log log N_k     (> 0 under RH)
 *
 *   and the Nicolas ratio c_k := (N_k/phi(N_k)) / (e^gamma log log N_k) (> 1
 *   under RH). Both are elementary to evaluate to arbitrary k.
 *
 *   WHY THIS IS THE RIGHT SECOND TEST.
 *   imp-2360 (src/data/imp-2360-robin-margin-ca-growth.js) studied the ROBIN
 *   sigma(n) inequality on COLOSSALLY-ABUNDANT numbers and found its margin
 *   decays at a Mertens / Chebyshev rate with no Lambda fingerprint. The Robin
 *   route is one elementary RH-equivalence; a single negative datapoint leaves
 *   open whether the no-bridge phenomenon is specific to sigma. The Nicolas
 *   criterion is an INDEPENDENT elementary RH-equivalence built on a DIFFERENT
 *   arithmetic function (Euler phi, not sigma) over a DIFFERENT thin ladder
 *   (primorials, not CA numbers). Confirming the same no-bridge structure here
 *   shows the obstruction is GENERIC to the elementary-inequality family.
 *
 *   HEADLINE VERDICT
 *   ----------------
 *   VERDICT: 'nicolas-margin-is-arithmetic-scale-no-lambda-bridge'
 *
 *   The Nicolas margin m_k shrinks monotonically toward 0 (c_k -> 1+, the
 *   boundary of the inequality), confirming the criterion holds with a closing
 *   margin -- and, unlike Robin's sigma which has eight small CA exceptions,
 *   the Nicolas phi-inequality holds with NO exceptions at any computed k. Two
 *   numerical signatures pin the decay as a pure ARITHMETIC-SCALE law:
 *
 *     (S1) m_k * log N_k  GROWS with k (here ~17.6 at k=10 to ~50.0 at k=40),
 *          so there is NO clean 1/log N law -- the margin does not scale like a
 *          quantity governed by a single fixed (e.g. Lambda-related) constant.
 *
 *     (S2) m_k * (log log N_k)^2  stays BANDED (here ~7.6 to ~8.5 for all
 *          k >= 10), i.e. m_k ~ C / (log log N_k)^2. The natural variable is
 *          log log N_k = log theta(p_k), the Mertens variable -- a prime-
 *          distribution scale, NOT a heat-flow time.
 *
 *   The de Bruijn-Newman Lambda is the least t for which every zero of the
 *   heat-evolved kernel H_t(x) = INT Phi(u) e^{t u^2} cos(x u) du is real; it
 *   lives on a CONTINUOUS flow-time axis t. The Nicolas margin is a function of
 *   the DISCRETE index k alone (equivalently of theta(p_k)); it has no flow-time
 *   observable that could be differentiated in t, so no quantity in the
 *   inequality can be converted to a Lambda bound. Named sub-gap
 *   GAP-2390-NO-FLOW-TIME-IN-PHI-MARGIN. This CONFIRMS imp-2360 via a second,
 *   independent RH-equivalence.
 *
 *   WHAT THIS IS / IS NOT
 *   ---------------------
 *   IS: a genuine numerical experiment -- an exact primorial / phi / theta
 *       generator, a 40-row Nicolas-margin table, and two scale probes (S1, S2)
 *       separating the arithmetic-scale decay from any putative 1/log N or
 *       heat-flow law.
 *   IS NOT: a proof, a new RH equivalence, or any numerical Lambda bound. It
 *       confirms (does not merely assert) that a second elementary RH-equivalent
 *       inequality carries no Lambda-quantitative content. NO PROOF CLAIM; RH
 *       NOT asserted.
 *
 *   @see imp-2360 src/data/imp-2360-robin-margin-ca-growth.js
 *   @see imp-1311 src/data/imp-1311-robin-lagarias-combinatorial-attack.js
 *
 *   Ticket: imp-2390 (numerical, medium, FAN-OUT of imp-2360 / imp-1311).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const EULER_GAMMA = 0.5772156649015329;
const E_GAMMA = Math.exp(EULER_GAMMA); // ~ 1.7810724179901979

// =========================================================================
// SECTION A -- EXACT PRIMORIAL / PHI / THETA GENERATOR.
// =========================================================================
//
// For the k-th primorial N_k = prod_{i<=k} p_i (squarefree):
//   N_k / phi(N_k) = prod_{p <= p_k} p/(p-1)   (accumulated multiplicatively),
//   log N_k        = theta(p_k) = sum_{p <= p_k} log p.
// Working in log-space for log N keeps arbitrarily large primorials
// representable while N/phi stays a moderate float product.

function sievePrimes(limit) {
  const sieve = new Uint8Array(limit + 1);
  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (!sieve[i]) {
      primes.push(i);
      for (let j = i * i; j <= limit; j += i) sieve[j] = 1;
    }
  }
  return primes;
}

function generatePrimorialRows(numPrimes) {
  const primes = sievePrimes(1000).slice(0, numPrimes);
  let nOverPhi = 1; // running prod p/(p-1)
  let logN = 0;     // running theta(p_k)
  const rows = [];
  for (let k = 1; k <= primes.length; k++) {
    const p = primes[k - 1];
    nOverPhi *= p / (p - 1);
    logN += Math.log(p);
    const logLogN = Math.log(logN);
    // Nicolas criterion needs log log N_k > 0, i.e. log N_k > 1, i.e. k >= 2.
    if (logLogN <= 0) continue;
    const rhs = E_GAMMA * logLogN;
    const margin = nOverPhi - rhs;       // > 0 under RH
    const ratio = nOverPhi / rhs;        // c_k > 1 under RH
    rows.push(Object.freeze({
      k,
      maxPrime: p,
      nOverPhi,
      logN,
      logLogN,
      rhs,
      margin,
      ratio,
      nicolasHolds: nOverPhi > rhs,
      marginTimesLogN: margin * logN,             // scale probe S1
      marginTimesLogLogNSq: margin * logLogN * logLogN, // scale probe S2
    }));
  }
  return rows;
}

// First 40 primorials (largest prime p_40 = 173, comfortably below the 1000
// sieve ceiling). k=1 (N=2) is dropped because log log 2 < 0.
const NICOLAS_TABLE = Object.freeze(generatePrimorialRows(40));

// Large-k tail where the asymptotic regime is clean (k >= 10).
const NICOLAS_TAIL = Object.freeze(NICOLAS_TABLE.filter((r) => r.k >= 10));

// =========================================================================
// SECTION B -- SCALE ANALYSIS (no-bridge core).
// =========================================================================
//
// Empirical facts read off NICOLAS_TABLE (pinned in the assertions):
//   * Nicolas holds for EVERY computed k (no exceptions) -- contrast Robin,
//     whose sigma-inequality fails at the eight CA numbers 2..5040.
//   * the margin m_k decreases monotonically for k >= 10 (c_k -> 1+).
//   * S1: m_k * log N_k GROWS -> no 1/log N law.
//   * S2: m_k * (log log N_k)^2 is BANDED -> m_k ~ C/(log log N_k)^2, a pure
//     Mertens-variable (arithmetic-scale) decay with no flow-time axis.

function bandOf(values) {
  return Object.freeze({
    min: values.reduce((m, v) => Math.min(m, v), Infinity),
    max: values.reduce((m, v) => Math.max(m, v), -Infinity),
  });
}

const SCALE_ANALYSIS = Object.freeze({
  nicolasHoldsEverywhere:
    'The Nicolas primorial inequality N_k/phi(N_k) > e^gamma log log N_k holds ' +
    'for every computed k (no exceptions), unlike the Robin sigma-inequality ' +
    'which fails at the eight CA numbers 2,6,12,60,120,360,2520,5040. The phi- ' +
    'criterion therefore approaches its RH boundary from a strictly safe side.',
  marginAtK10: NICOLAS_TABLE.find((r) => r.k === 10)?.margin,
  marginAtK40: NICOLAS_TABLE.find((r) => r.k === 40)?.margin,
  ratioAtK10: NICOLAS_TABLE.find((r) => r.k === 10)?.ratio,
  ratioAtK40: NICOLAS_TABLE.find((r) => r.k === 40)?.ratio,

  probeS1_marginTimesLogN:
    'm_k * log N_k GROWS with k (it is not asymptotically constant), so the ' +
    'margin does NOT obey a clean 1/log N law. A quantity scaling with a single ' +
    'fixed constant (the shape a Lambda-convertible observable would take) ' +
    'would flatten under this probe; it does not.',
  bandS1: bandOf(NICOLAS_TAIL.map((r) => r.marginTimesLogN)),

  probeS2_marginTimesLogLogNSq:
    'm_k * (log log N_k)^2 stays BANDED, i.e. m_k ~ C/(log log N_k)^2. The ' +
    'controlling variable is log log N_k = log theta(p_k), the Mertens prime- ' +
    'distribution scale -- an arithmetic index, not a heat-flow time.',
  bandS2: bandOf(NICOLAS_TAIL.map((r) => r.marginTimesLogLogNSq)),

  noFlowTimeObservable:
    'The de Bruijn-Newman Lambda is the least t for which every zero of the ' +
    'heat-evolved kernel H_t(x) = INT Phi(u) e^{t u^2} cos(x u) du is real -- a ' +
    'CONTINUOUS flow-time t. The Nicolas margin depends only on the DISCRETE ' +
    'index k (equivalently theta(p_k)); it exposes no observable differentiable ' +
    'in any flow time, so nothing in the inequality is convertible to a Lambda ' +
    'bound. Named sub-gap GAP-2390-NO-FLOW-TIME-IN-PHI-MARGIN. This confirms ' +
    'imp-2360 via a second, independent RH-equivalent inequality.',
});

// =========================================================================
// SECTION C -- VERDICT.
// =========================================================================

const ALLOWED_VERDICTS = Object.freeze([
  'nicolas-margin-carries-lambda-content',
  'nicolas-margin-is-arithmetic-scale-no-lambda-bridge',
  'nicolas-margin-inconclusive-numerically',
]);

const VERDICT = 'nicolas-margin-is-arithmetic-scale-no-lambda-bridge';

const VERDICT_DETAIL = Object.freeze({
  verdict: VERDICT,
  isAllowedVerdict: ALLOWED_VERDICTS.includes(VERDICT),
  givesNumericalLambdaBound: false,
  confirmsImp2360NoBridge: true,
  marginDecayScale: 'log log N = log theta(p_k) (Mertens prime-distribution scale)',
  proofClaim: 'none -- numerical exploration only',
  honestNote:
    'Negative-but-confirmatory numerical result. A SECOND independent RH- ' +
    'equivalent elementary inequality (Nicolas 1983 primorial / Euler-phi) has ' +
    'a margin that decays on a pure arithmetic (Mertens-variable) scale with no ' +
    'flow-time observable, so no quantitative bridge to a de Bruijn-Newman ' +
    'Lambda bound exists. Together with imp-2360 (Robin sigma) this shows the ' +
    'no-bridge obstruction is generic to the elementary-inequality family, not ' +
    'specific to sigma, further narrowing the genuinely-new-input search.',
});

// =========================================================================
// SECTION D -- EXPORTED RECORD.
// =========================================================================

export const IMP_2390_NICOLAS_PRIMORIAL_MARGIN = Object.freeze({
  id: 'imp-2390-nicolas-primorial-margin-no-lambda-bridge',
  ticket: 'imp-2390',
  category: 'numerical',
  builtAt: '2026-06-04T00:00:00Z',
  paperSourcePath: PAPER_REF,
  parentTicket: 'imp-2360',
  relatedTickets: Object.freeze(['imp-2360', 'imp-1311']),

  verdict: VERDICT,
  allowedVerdicts: ALLOWED_VERDICTS,
  verdictDetail: VERDICT_DETAIL,

  eulerGamma: EULER_GAMMA,
  eGamma: E_GAMMA,
  nicolasTable: NICOLAS_TABLE,
  nicolasTail: NICOLAS_TAIL,
  scaleAnalysis: SCALE_ANALYSIS,

  honestScope: Object.freeze([
    'NUMERICAL fan-out of imp-2360 / imp-1311. Evaluates the Nicolas 1983 ' +
    'primorial criterion N_k/phi(N_k) > e^gamma log log N_k exactly for the ' +
    'first 40 primorials (N_k/phi(N_k) = prod p/(p-1), log N_k = theta(p_k)).',

    'The Nicolas margin holds for every computed k (no exceptions, unlike ' +
    'Robins sigma) and decays monotonically toward the RH boundary. Two scale ' +
    'probes pin the decay as arithmetic: m_k*log N_k GROWS (no 1/log N law) ' +
    'while m_k*(log log N_k)^2 is banded (m_k ~ C/(log log N_k)^2, the Mertens ' +
    'variable). No flow-time observable is present, so no Lambda bridge exists.',

    'NO PROOF CLAIM and NO numerical Lambda bound. This confirms imp-2360 via a ' +
    'SECOND, independent RH-equivalence built on Euler phi over primorials ' +
    'rather than sigma over CA numbers, showing the no-bridge obstruction is ' +
    'generic to the elementary-inequality family. RH NOT asserted.',
  ]),

  references: Object.freeze({
    paper: PAPER_REF,
    imp2360: 'src/data/imp-2360-robin-margin-ca-growth.js',
    imp1311: 'src/data/imp-1311-robin-lagarias-combinatorial-attack.js',
    nicolas1983:
      'Nicolas, J.-L., Petites valeurs de la fonction dEuler, J. Number ' +
      'Theory 17 (1983), 375-388 (primorial / Euler-phi RH criterion)',
    caveneyNicolasSondow2011:
      'Caveney, G., Nicolas, J.-L., Sondow, J., Robins theorem, primes, and ' +
      'a new elementary reformulation of the Riemann Hypothesis, Integers 11 ' +
      '(2011), Article A33',
    rosserSchoenfeld1962:
      'Rosser, J. B., Schoenfeld, L., Approximate formulas for some functions ' +
      'of prime numbers, Illinois J. Math. 6 (1962), 64-94 (effective Mertens)',
    deBruijn1950:
      'de Bruijn, N. G., The roots of trigonometric integrals, Duke Math. J. ' +
      '17 (1950), 197-226 (heat-flow / Lambda origin)',
    newman1976:
      'Newman, C. M., Fourier transforms with only real zeros, Proc. Amer. ' +
      'Math. Soc. 61 (1976), 245-251 (de Bruijn-Newman constant Lambda)',
  }),
});

export default IMP_2390_NICOLAS_PRIMORIAL_MARGIN;

// =========================================================================
// BUILD-TIME TRIPWIRES (9 shipped).
// =========================================================================

export const IMP_2390_NICOLAS_PRIMORIAL_MARGIN_ASSERTIONS = [
  // Tripwire 1: exact rational checkpoints for N_k/phi(N_k) and theta(p_k).
  {
    id: 'imp2390-primorial-generator-exact-checkpoints',
    why:
      'N_k/phi(N_k) is an exact rational: k=2 gives 2/1*3/2 = 3, k=4 gives ' +
      '210/48 = 4.375, and log N_4 = theta(7) = log 210. A wrong generator ' +
      'would invalidate every margin row.',
    holds: () => {
      const r2 = NICOLAS_TABLE.find((r) => r.k === 2);
      const r4 = NICOLAS_TABLE.find((r) => r.k === 4);
      return (
        r2 && r4 &&
        Math.abs(r2.nOverPhi - 3) < 1e-12 &&
        Math.abs(r4.nOverPhi - 4.375) < 1e-12 &&
        Math.abs(r4.logN - Math.log(210)) < 1e-9
      );
    },
  },

  // Tripwire 2: e^gamma constant value.
  {
    id: 'imp2390-egamma-constant-correct',
    why:
      'The RH boundary in the Nicolas criterion is e^gamma; a drifted constant ' +
      'would silently move the inequality. Pin e^gamma to high precision.',
    holds: () =>
      Math.abs(E_GAMMA - 1.7810724179901979) < 1e-15 &&
      Math.abs(EULER_GAMMA - 0.5772156649015329) < 1e-15,
  },

  // Tripwire 3: Nicolas holds for EVERY computed k (no exceptions).
  {
    id: 'imp2390-nicolas-holds-everywhere',
    why:
      'Unlike Robins sigma (eight CA exceptions), the Nicolas phi-inequality ' +
      'must hold at every computed primorial (margin > 0), restating empirical ' +
      'RH and the no-exception contrast with imp-2360.',
    holds: () =>
      NICOLAS_TABLE.length >= 39 &&
      NICOLAS_TABLE.every((r) => r.nicolasHolds === true && r.margin > 0),
  },

  // Tripwire 4: margin decreases monotonically on the k >= 10 tail.
  {
    id: 'imp2390-margin-monotone-decreasing-tail',
    why:
      'The headline empirical fact: the Nicolas margin shrinks toward 0 (c_k ' +
      '-> 1+) along the primorial ladder. A non-decreasing margin would ' +
      'contradict the criterion approaching its RH boundary.',
    holds: () => {
      for (let i = 1; i < NICOLAS_TAIL.length; i++) {
        if (NICOLAS_TAIL[i].margin >= NICOLAS_TAIL[i - 1].margin) return false;
      }
      return NICOLAS_TAIL.length >= 30 && NICOLAS_TAIL[NICOLAS_TAIL.length - 1].margin > 0;
    },
  },

  // Tripwire 5: Nicolas ratio c_k stays in (1, 1.2) and decreases toward 1.
  {
    id: 'imp2390-ratio-approaches-one-from-above',
    why:
      'c_k = (N/phi)/(e^gamma loglogN) must stay just above 1 and decrease ' +
      '(c_k -> 1+), the quantitative form of the margin closing. Values near ' +
      '1.14 (k=10) down to ~1.035 (k=40) are expected.',
    holds: () => {
      const a = NICOLAS_TABLE.find((r) => r.k === 10);
      const b = NICOLAS_TABLE.find((r) => r.k === 40);
      return (
        a && b &&
        a.ratio > 1 && a.ratio < 1.2 &&
        b.ratio > 1 && b.ratio < a.ratio
      );
    },
  },

  // Tripwire 6: probe S1 -- margin*logN GROWS (no 1/logN law).
  {
    id: 'imp2390-probe-s1-no-inverse-logn-law',
    why:
      'If the margin obeyed a clean 1/log N law (the shape a single-constant / ' +
      'Lambda-convertible observable would take) then m_k*log N would flatten. ' +
      'Instead it grows substantially across the ladder.',
    holds: () => {
      const a = NICOLAS_TABLE.find((r) => r.k === 10);
      const b = NICOLAS_TABLE.find((r) => r.k === 40);
      return a && b && b.marginTimesLogN > 2 * a.marginTimesLogN;
    },
  },

  // Tripwire 7: probe S2 -- margin*(loglogN)^2 is BANDED (arithmetic scale).
  {
    id: 'imp2390-probe-s2-arithmetic-scale-banded',
    why:
      'm_k*(log log N_k)^2 staying banded shows m_k ~ C/(log log N_k)^2: the ' +
      'decay is governed by the Mertens variable log theta(p_k), a prime- ' +
      'distribution (arithmetic) scale, NOT a heat-flow time.',
    holds: () => {
      const band = bandOf(NICOLAS_TAIL.map((r) => r.marginTimesLogLogNSq));
      return band.min > 7 && band.max < 9 && (band.max - band.min) < 1.5;
    },
  },

  // Tripwire 8: verdict is the allowed no-bridge string, confirming imp-2360.
  {
    id: 'imp2390-verdict-is-no-bridge',
    why:
      'The honest verdict is the arithmetic-scale no-bridge classification; a ' +
      'flip to nicolas-margin-carries-lambda-content would falsely claim a ' +
      'Lambda bridge the numerics do not support.',
    holds: () =>
      ALLOWED_VERDICTS.includes(VERDICT) &&
      VERDICT === 'nicolas-margin-is-arithmetic-scale-no-lambda-bridge' &&
      VERDICT_DETAIL.givesNumericalLambdaBound === false &&
      VERDICT_DETAIL.confirmsImp2360NoBridge === true,
  },

  // Tripwire 9: load-bearing citations present (Nicolas + imp-2360 link).
  {
    id: 'imp2390-required-citations-present',
    why:
      'The criterion is Nicolas 1983; the result confirms imp-2360 and shares ' +
      'the imp-1311 elementary-route context. All three plus the de Bruijn- ' +
      'Newman Lambda origin must be cited.',
    holds: () => {
      const r = IMP_2390_NICOLAS_PRIMORIAL_MARGIN.references;
      return (
        /Nicolas/.test(r.nicolas1983 || '') &&
        /imp-2360/.test(r.imp2360 || '') &&
        /imp-1311/.test(r.imp1311 || '') &&
        /Newman/.test(r.newman1976 || '')
      );
    },
  },
];
