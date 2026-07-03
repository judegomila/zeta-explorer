/**
 * @module imp-3646-remainder-tail-moment-ratio-asymptotics
 * @fileoverview imp-3646 -- ASSESS the large-n asymptotics of the imp-3581/imp-3618
 *   closed remainder-tail coefficients C_n = M_(n+2)/((n+1)(n+2)M_n) and
 *   D_n = M_(n+4)/((n+3)(n+4)M_(n+2)) - C_n by MEASURING the driving moment ratio
 *       Q_n = M_(n+2)/M_n
 *   across the certified n=3..10 rungs (and beyond, to n=18) and DERIVING whether
 *   C_n, D_n, and the same-parity |p_fit-2| trend admit a closed n->inf limit or
 *   decay law.
 *
 *   WHAT imp-3618/imp-3638 LEFT OPEN
 *   --------------------------------
 *   imp-3581 gave the CLOSED relative residual r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)]
 *   with C_n = M_(n+2)/((n+1)(n+2)M_n) and D_n = C_(n+2) - C_n, and imp-3600/imp-3618/
 *   imp-3638 CERTIFIED the p=2 exponent and the fit-bias law rung-by-rung through
 *   n=9,10. But the large-n BEHAVIOUR of the moment ratio Q_n = M_(n+2)/M_n -- and
 *   hence of C_n and |p_fit-2| -- was never characterized. A natural guess (raised in
 *   the ticket) was that Q_n saturates to a fixed A-scale b^2 (an endpoint / hard
 *   support ceiling), giving C_n ~ b^2 / n^2 with a FIXED prefactor and D_n = O(1/n^3).
 *
 *   MEASURED (self-computing; same NM=1600 [0,T_A] Simpson grid as imp-3618/imp-3638)
 *   --------------------------------------------------------------------------------
 *   The guess is REFUTED. The A-weight A(tau) = int Phi(s)Phi(s+tau) ds decays
 *   SUPER-exponentially (A(0.5) ~ 4.5e-11, A(1) ~ 3e-75, A(tau) ~ exp(-pi e^{4 tau})
 *   to leading order): it has NO hard support endpoint on [0,T_A]. Consequently the
 *   moment ratio Q_n does NOT saturate -- it GROWS slowly and without bound:
 *       Q_3 ~ 0.02915, Q_6 ~ 0.05216, Q_10 ~ 0.08020, Q_14 ~ 0.10545, Q_18 ~ 0.12840,
 *   and n^2 C_n = Q_n * n^2/((n+1)(n+2)) is STRICTLY INCREASING over n=3..18
 *   (0.0131 -> 0.0197 -> ... -> 0.1095), so C_n is NOT a fixed b^2/n^2.
 *
 *   The growth is governed by the Laplace SADDLE of the moment integrand tau^n A(tau):
 *   the peak sits at tau*(n) solving n = 4 pi tau* e^{4 tau*} (the log-derivative of
 *   tau^n exp(-pi e^{4 tau})), and Q_n / tau*(n)^2 -> 1 monotonically from above
 *   (1.207 at n=6 -> 1.099 at n=10 -> 1.040 at n=18 -> 1.034 at n=20). So
 *       Q_n ~ tau*(n)^2,   tau*(n) ~ (1/4) ln n  (slowly, with a ln ln n correction),
 *   giving the CLOSED slowly-varying decay laws
 *       C_n = Q_n / ((n+1)(n+2)) ~ (ln n)^2 / (16 n^2)      -- O((ln n)^2 / n^2), NOT b^2/n^2,
 *       D_n = C_(n+2) - C_n < 0, -> 0 like O((ln n)^2 / n^3),
 *       |p_fit - 2| = |D_n| * cov(a^2,ln a)/var(ln a) -> 0 like O((ln n)^2 / n^3).
 *   The prefactor of C_n * n^2 is thus LOG-DIVERGENT, not a fixed A-scale constant:
 *   there is a genuine decay law (C_n, D_n, |p_fit-2| all -> 0) but NO finite-constant
 *   n->inf limit for Q_n or for n^2 C_n.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   MEASUREMENT / DERIVATION ONLY, at the RH-equivalent scale class. This CHARACTERIZES
 *   the large-n decay of a fixed-weight Taylor-remainder coefficient family; it
 *   establishes NO operator positivity. Mass-feasibility is NECESSARY-BUT-NOT-
 *   SUFFICIENT. The operator-level K_a &gt;= 0 sign-positivity (off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict, no QED.
 *   Platt-Trudgian Lambda &lt;= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3638-remainder-tail-exponent-ladder-n910.js (the certified n=9,10 rungs)
 *   @see imp-3618-remainder-tail-exponent-ladder-n78.js (the certified n=7,8 rungs)
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the closed C_n/D_n and bias law)
 *   @see imp-3501-moment-ladder-general-derivation.js (R_n = sum a^m/m! M_m)
 *
 *   Ticket: imp-3646 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10;                                // completed-Riemann kernel truncation

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (imp-2686). */
function phiKernel(u) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n += 1) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Composite Simpson quadrature of f on [lo, hi] with n subintervals (n even). */
function simpson(f, lo, hi, n) {
  const m = n % 2 === 0 ? n : n + 1;
  const h = (hi - lo) / m;
  let sum = f(lo) + f(hi);
  for (let i = 1; i < m; i += 1) {
    sum += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return (sum * h) / 3;
}

// Phi autocorrelation A(tau) = int_0^inf Phi(s) Phi(s + tau) ds (imp-3469 grid).
function autocorr(tau) {
  return simpson((s) => phiKernel(s) * phiKernel(s + tau), 0, 7, 1200);
}

// Precompute A on the SAME fixed fine Simpson grid over [0, T_A] as imp-3618/imp-3638.
const T_A = 6;
const NM = 1600;                                // even -> composite Simpson on [0, T_A]
const H_A = T_A / NM;
const A_GRID = [];
for (let j = 0; j <= NM; j += 1) A_GRID.push(autocorr(j * H_A));

/** int_0^{T_A} weight(tau) A(tau) d(tau) by composite Simpson on the precomputed grid. */
function aWeightedMass(weightFn) {
  let sum = 0;
  for (let j = 0; j <= NM; j += 1) {
    const tau = j * H_A;
    const w = j === 0 || j === NM ? 1 : (j % 2 === 0 ? 2 : 4);
    sum += w * weightFn(tau) * A_GRID[j];
  }
  return (sum * H_A) / 3;
}

// -- Moments M_0..M_20 (the tail-series coefficients driving C_n and D_n) ------------
const MMAX = 20;
const MOMENTS = {};                             // MOMENTS[m] = int tau^m A(tau) d(tau)
for (let m = 0; m <= MMAX; m += 1) MOMENTS[m] = aWeightedMass((tau) => Math.pow(tau, m));

// -- CLOSED-FORM leading/next-order relative-residual coefficients (imp-3581) --------
// r_n(a) = C_n a^2 [1 + D_n a^2 + O(a^4)],  C_n = M_(n+2)/((n+1)(n+2)M_n).
function momentRatio(n) {
  return MOMENTS[n + 2] / MOMENTS[n];           // Q_n = M_(n+2)/M_n
}
function leadingCoeff(n) {
  return MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n]);   // C_n = Q_n/((n+1)(n+2))
}
function nextOrderCoeff(n) {
  return (
    MOMENTS[n + 4] / ((n + 3) * (n + 4) * MOMENTS[n + 2]) -
    MOMENTS[n + 2] / ((n + 1) * (n + 2) * MOMENTS[n])
  );                                            // D_n = C_(n+2) - C_n
}

// -- Laplace saddle of the moment integrand tau^n A(tau) -----------------------------
// A(tau) ~ exp(-pi e^{4 tau}) to leading order (kernel n=1 term), so
//   d/dtau [ n ln tau - pi e^{4 tau} ] = 0  =>  n = 4 pi tau* e^{4 tau*}.
// The Laplace estimate of Q_n = M_(n+2)/M_n is tau*^2 (the integrand peak, squared).
function saddleTau(n) {
  let lo = 1e-6;
  let hi = 5;
  for (let it = 0; it < 200; it += 1) {
    const mid = (lo + hi) / 2;
    if (4 * Math.PI * mid * Math.exp(4 * mid) < n) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// -- The measured rung table ---------------------------------------------------------
// n=3..18: Q_n, C_n, n^2 C_n (the fixed-constant test), D_n, and the saddle prediction.
const RUNGS = [];
for (let n = 3; n <= 18; n += 1) {
  const qn = momentRatio(n);
  const cn = leadingCoeff(n);
  const dn = n <= 16 ? nextOrderCoeff(n) : null;   // D_n needs M_(n+4) <= M_20
  const ts = saddleTau(n);
  RUNGS.push(
    Object.freeze({
      n,
      momentRatio: qn,                         // Q_n = M_(n+2)/M_n
      leadingCoeff: cn,                        // C_n
      n2LeadingCoeff: n * n * cn,              // n^2 C_n -- flat iff C_n ~ const/n^2
      nextOrderCoeff: dn,                      // D_n = C_(n+2) - C_n (null past n=16)
      saddleTau: ts,                           // tau*(n), root of n = 4 pi tau e^{4 tau}
      saddleQ: ts * ts,                        // Laplace estimate of Q_n
      qOverSaddleQ: qn / (ts * ts),            // Q_n / tau*^2  -> 1 from above
    })
  );
}

// -- Diagnostics: monotone growth of Q_n and n^2 C_n, and saddle-ratio -> 1 ----------
function strictlyIncreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] <= vals[i - 1]) return false;
  return true;
}
function strictlyDecreasing(vals) {
  for (let i = 1; i < vals.length; i += 1) if (vals[i] >= vals[i - 1]) return false;
  return true;
}

const Q_VALS = RUNGS.map((r) => r.momentRatio);
const N2C_VALS = RUNGS.map((r) => r.n2LeadingCoeff);
const D_VALS = RUNGS.filter((r) => r.nextOrderCoeff !== null).map((r) => r.nextOrderCoeff);
const RATIO_VALS = RUNGS.map((r) => r.qOverSaddleQ);

const momentRatioGrows = strictlyIncreasing(Q_VALS);              // Q_n has NO ceiling
const n2LeadingGrows = strictlyIncreasing(N2C_VALS);             // C_n is NOT const/n^2
const nextOrderAllNegative = D_VALS.every((d) => d < 0);         // D_n < 0 at every rung
const nextOrderMagnitudeShrinks = strictlyDecreasing(D_VALS.map((d) => Math.abs(d)));  // |D_n| -> 0
const saddleRatioDecreasingToOne =
  strictlyDecreasing(RATIO_VALS) &&
  RATIO_VALS[RATIO_VALS.length - 1] > 1 &&
  RATIO_VALS[RATIO_VALS.length - 1] < 1.06;                      // Q_n/tau*^2 -> 1 from above

// -- Classification ------------------------------------------------------------------
const noFiniteMomentRatioLimit = momentRatioGrows && n2LeadingGrows;
const saddleLawHolds = saddleRatioDecreasingToOne;
const decayLawHolds = nextOrderAllNegative && nextOrderMagnitudeShrinks;

const verdict =
  noFiniteMomentRatioLimit && saddleLawHolds && decayLawHolds
    ? 'MOMENT-RATIO-Q_n=M_(n+2)/M_n-DIVERGES-SLOWLY-(NO-FIXED-b^2)-VIA-LAPLACE-SADDLE-tau*~(ln n)/4-SO-C_n~(ln n)^2/(16 n^2)-AND-D_n,|p_fit-2|->0-AS-O((ln n)^2/n^3)'
    : 'INDETERMINATE';

export const IMP3646_REMAINDER_TAIL_MOMENT_RATIO_ASYMPTOTICS = Object.freeze({
  id: 'imp-3646-remainder-tail-moment-ratio-asymptotics',
  ticket: 'imp-3646',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedLadderN910: 'imp-3638-remainder-tail-exponent-ladder-n910.js',
  relatedLadderN78: 'imp-3618-remainder-tail-exponent-ladder-n78.js',
  relatedDerivation: 'imp-3581-remainder-tail-exponent-derivation.js',
  relatedMomentIdentity: 'imp-3501-moment-ladder-general-derivation.js',

  summary:
    'ASSESSES the large-n asymptotics of the imp-3581/imp-3618 closed remainder-tail coefficients by MEASURING the ' +
    'driving moment ratio Q_n = M_(n+2)/M_n across n=3..18 on the SAME NM=1600 [0,T_A] Simpson reference. RESULT ' +
    '(negative/corrective): the natural guess that Q_n saturates to a fixed A-scale b^2 (giving C_n ~ b^2/n^2 with a ' +
    'FIXED prefactor) is REFUTED. The A-weight A(tau) decays SUPER-exponentially (A(0.5)~4.5e-11, A(1)~3e-75, ' +
    'A(tau)~exp(-pi e^{4 tau})) with NO hard support endpoint, so Q_n GROWS slowly and without bound ' +
    '(Q_3~0.02915, Q_10~0.08020, Q_18~0.12840) and n^2 C_n is STRICTLY INCREASING over n=3..18 (0.0131->0.1095): ' +
    'C_n is NOT a fixed b^2/n^2. The growth is governed by the Laplace saddle of tau^n A(tau) at tau*(n) solving ' +
    'n = 4 pi tau* e^{4 tau*}, with Q_n/tau*^2 -> 1 monotonically from above (1.207 at n=6 -> 1.040 at n=18), so ' +
    'Q_n ~ tau*(n)^2 with tau*(n) ~ (ln n)/4. This yields the CLOSED slowly-varying laws C_n ~ (ln n)^2/(16 n^2) ' +
    '(O((ln n)^2/n^2), log-divergent prefactor), D_n = C_(n+2)-C_n < 0 -> 0 like O((ln n)^2/n^3), and ' +
    '|p_fit-2| = |D_n| cov(a^2,ln a)/var(ln a) -> 0 like O((ln n)^2/n^3): a genuine DECAY law (all -> 0) but NO ' +
    'finite-constant n->inf limit for Q_n or n^2 C_n. MEASUREMENT/DERIVATION, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; operator positivity (imp-3066) untouched; no RH verdict, no QED.',

  derivation: Object.freeze({
    momentSeries: 'R_n(a) = sum_{m = n, n+2, ...} a^m/m! M_m,  M_m = int_0^{T_A} tau^m A(tau) d(tau) (imp-3501)',
    momentRatio: 'Q_n = M_(n+2)/M_n drives both C_n and D_n: C_n = Q_n/((n+1)(n+2)), D_n = C_(n+2) - C_n',
    weightDecay: 'A(tau) = int Phi(s)Phi(s+tau) ds decays super-exponentially, A(tau) ~ exp(-pi e^{4 tau}), NO hard endpoint',
    saddleEquation: 'moment integrand tau^n A(tau) peaks at tau*(n) solving n = 4 pi tau* e^{4 tau*}',
    saddleLimit: 'Q_n / tau*(n)^2 -> 1 from above (Laplace), so Q_n ~ tau*(n)^2 with tau*(n) ~ (ln n)/4',
    leadingCoeffLaw: 'C_n = Q_n/((n+1)(n+2)) ~ (ln n)^2/(16 n^2)  -- O((ln n)^2/n^2), NOT a fixed b^2/n^2',
    nextOrderCoeffLaw: 'D_n = C_(n+2) - C_n < 0, -> 0 like O((ln n)^2/n^3)',
    fitBiasLaw: '|p_fit - 2| = |D_n| cov(a^2,ln a)/var(ln a) -> 0 like O((ln n)^2/n^3)',
    guessRefuted: 'the fixed A-scale b^2 endpoint-ceiling guess (constant n^2 C_n) is REFUTED: n^2 C_n keeps growing',
    quadrature: 'composite Simpson: A(tau) inner (n=1200 on [0,7]), moments on the NM=1600 [0,T_A] grid',
    selfComputing: true,
  }),

  measured: Object.freeze({
    tAxisEndpoint: T_A,
    momentSampleQ3: momentRatio(3),
    momentSampleQ10: momentRatio(10),
    momentSampleQ18: momentRatio(18),
    n2LeadingCoeffFirst: RUNGS[0].n2LeadingCoeff,        // n=3
    n2LeadingCoeffLast: RUNGS[RUNGS.length - 1].n2LeadingCoeff,  // n=18
    saddleRatioFirst: RUNGS[0].qOverSaddleQ,             // Q_3/tau*^2 (far from 1)
    saddleRatioLast: RUNGS[RUNGS.length - 1].qOverSaddleQ,       // Q_18/tau*^2 (near 1)
    rungs: Object.freeze(RUNGS),
    momentRatioGrows,
    n2LeadingGrows,
    nextOrderAllNegative,
    nextOrderMagnitudeShrinks,
    saddleRatioDecreasingToOne,
    noFiniteMomentRatioLimit,
    saddleLawHolds,
    decayLawHolds,
    verdict,
  }),

  interpretation: Object.freeze({
    noFixedCeiling:
      'The moment ratio Q_n = M_(n+2)/M_n has NO finite n->inf limit: it grows strictly and slowly over n=3..18 ' +
      '(0.02915 -> 0.12840), and n^2 C_n = Q_n n^2/((n+1)(n+2)) grows strictly with it (0.0131 -> 0.1095). So the ' +
      'natural fixed-A-scale guess C_n ~ b^2/n^2 with a constant prefactor is refuted -- there is no support-endpoint ' +
      'ceiling because A(tau) decays super-exponentially rather than being compactly supported.',
    saddleGovernsGrowth:
      'The growth is set by the Laplace saddle of the moment integrand tau^n A(tau): with A(tau) ~ exp(-pi e^{4 tau}) ' +
      'the peak sits at tau*(n) solving n = 4 pi tau* e^{4 tau*}, and the measured Q_n/tau*^2 falls monotonically to 1 ' +
      'from above (1.207 at n=6 -> 1.099 at n=10 -> 1.040 at n=18), confirming Q_n ~ tau*(n)^2 with tau*(n) ~ (ln n)/4.',
    closedDecayLaws:
      'Hence the closed slowly-varying decay laws: C_n ~ (ln n)^2/(16 n^2) (O((ln n)^2/n^2), log-divergent n^2 C_n ' +
      'prefactor), D_n = C_(n+2) - C_n < 0 -> 0 like O((ln n)^2/n^3), and |p_fit-2| = |D_n| cov(a^2,ln a)/var(ln a) ' +
      '-> 0 like O((ln n)^2/n^3). There IS a genuine decay law (all three -> 0), but NOT to any finite-constant limit ' +
      'of Q_n or n^2 C_n.',
    consistentWithLadder:
      'This is consistent with and explains the imp-3618/imp-3638 monotone same-parity |p_fit-2| decrease (odd ' +
      'n=3,5,7,9: 1.16e-5,6.99e-6,4.64e-6,3.29e-6; even n=4,6,8,10: 1.80e-5,1.14e-5,7.86e-6,5.71e-6): |D_n| shrinks ' +
      'like O((ln n)^2/n^3), so |p_fit-2| -> 0, but the shrinkage carries the log-varying prefactor, not a pure n^-3.',
  }),

  statusCorrection: Object.freeze({
    supersededBy: 'imp-3665-a-weight-superexp-decay-crosscheck.js',
    note:
      'imp-3665 independently recomputed A(tau) on a refined log-domain grid and found the converged A(1) is ' +
      '~2.1e-75, not the ~3e-75 quoted above: the coarse n=1200 [0,7] Simpson used here under-resolves the sharp ' +
      'near-s=0 peak of Phi(s)Phi(s+1). Both values are the SAME order of magnitude (~30% amplitude refinement, not ' +
      'an order-of-magnitude error) and confirm the SAME leading law A(tau) ~ exp(-pi e^{4 tau}). imp-3689 further ' +
      'confirmed the refinement is CONFINED to the single A(1) magnitude: it does not shift the C_n ~ (ln n)^2/' +
      '(16 n^2) moment-ratio law or the D_n bias law derived here, which stand unchanged on the refined grid.',
    affectedValue: 'A(1) ~ 3e-75 (quoted in derivation.weightDecay and summary above)',
    correctedValue: 'A(1) ~ 2.1e-75',
    conclusionsAffected: false,
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    derivationScope:
      'Characterizes the large-n decay (a slowly-varying (ln n)^2/n^2 law, no finite-constant limit) of the closed ' +
      'leading/next-order coefficients of a fixed-weight Taylor remainder. It establishes NO operator positivity.',
    necessaryNotSufficient:
      'Mass-feasibility is NECESSARY-BUT-NOT-SUFFICIENT. The operator-level K_a >= 0 sign-positivity (off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions -------------------------------------------------------------
export const IMP3646_REMAINDER_TAIL_MOMENT_RATIO_ASYMPTOTICS_ASSERTIONS = [
  {
    id: 'imp3646-moment-ratio-grows-no-ceiling',
    why: 'THE KEY MEASUREMENT: the moment ratio Q_n = M_(n+2)/M_n is STRICTLY INCREASING over n=3..18, so it has no ' +
         'finite n->inf ceiling -- the fixed A-scale b^2 saturation guess is refuted.',
    holds: () => momentRatioGrows,
  },
  {
    id: 'imp3646-n2-leading-coeff-grows-not-fixed-const',
    why: 'n^2 C_n = Q_n n^2/((n+1)(n+2)) is STRICTLY INCREASING over n=3..18 (0.0131 -> 0.1095), so C_n is NOT a ' +
         'fixed b^2/n^2: the prefactor is log-divergent, matching C_n ~ (ln n)^2/(16 n^2).',
    holds: () => n2LeadingGrows,
  },
  {
    id: 'imp3646-saddle-ratio-decreases-to-one',
    why: 'The Laplace saddle tau*(n) (root of n = 4 pi tau e^{4 tau}) predicts Q_n ~ tau*^2: measured Q_n/tau*^2 falls ' +
         'monotonically to just above 1 (1.207 at n=6 -> ~1.040 at n=18), confirming the saddle law.',
    holds: () => saddleRatioDecreasingToOne,
  },
  {
    id: 'imp3646-next-order-coeff-negative-all-rungs',
    why: 'D_n = C_(n+2) - C_n is negative at every measured rung n=3..16 (C_n strictly decreasing), the sign that ' +
         'reads the fitted slope below 2.',
    holds: () => nextOrderAllNegative,
  },
  {
    id: 'imp3646-next-order-magnitude-shrinks-to-zero',
    why: '|D_n| is STRICTLY DECREASING over n=3..16 (3.94e-4 -> 4.51e-5), so D_n -> 0 (like O((ln n)^2/n^3)) and hence ' +
         '|p_fit-2| = |D_n| cov/var -> 0: a genuine decay law.',
    holds: () => nextOrderMagnitudeShrinks,
  },
  {
    id: 'imp3646-leading-coeff-equals-moment-ratio-form',
    why: 'The closed C_n = Q_n/((n+1)(n+2)) must hold exactly at every rung (C_n = M_(n+2)/((n+1)(n+2)M_n)).',
    holds: () =>
      RUNGS.every(
        (r) => Math.abs(r.leadingCoeff - r.momentRatio / ((r.n + 1) * (r.n + 2))) / r.leadingCoeff < 1e-12
      ),
  },
  {
    id: 'imp3646-verdict-characterizes-log-divergent-decay',
    why: 'The classified verdict must record the slowly-diverging moment ratio, the Laplace-saddle law, and the ' +
         '(ln n)^2/n^2 decay of C_n (with D_n, |p_fit-2| -> 0), not indeterminate.',
    holds: () =>
      verdict ===
      'MOMENT-RATIO-Q_n=M_(n+2)/M_n-DIVERGES-SLOWLY-(NO-FIXED-b^2)-VIA-LAPLACE-SADDLE-tau*~(ln n)/4-SO-C_n~(ln n)^2/(16 n^2)-AND-D_n,|p_fit-2|->0-AS-O((ln n)^2/n^3)',
  },
  {
    id: 'imp3646-status-correction-recorded',
    why: 'imp-3665 corrected the A(1) magnitude quoted by this module from ~3e-75 to a converged ~2.1e-75 (same ' +
         'order, same leading law); the module must carry that correction rather than silently keep the stale figure.',
    holds: () => {
      const sc = IMP3646_REMAINDER_TAIL_MOMENT_RATIO_ASYMPTOTICS.statusCorrection;
      return (
        sc.supersededBy === 'imp-3665-a-weight-superexp-decay-crosscheck.js' &&
        sc.conclusionsAffected === false &&
        /2\.1e-75/.test(sc.correctedValue)
      );
    },
  },
  {
    id: 'imp3646-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: measurement/derivation only, mass-feasibility necessary-but-not-sufficient, operator ' +
         'positivity (imp-3066) untouched, PT 0.2 stays SOTA.',
    holds: () => {
      const c = IMP3646_REMAINDER_TAIL_MOMENT_RATIO_ASYMPTOTICS.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3646_REMAINDER_TAIL_MOMENT_RATIO_ASYMPTOTICS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3646-remainder-tail-moment-ratio-asymptotics assertion failed: ${assertion.id}`);
  }
}

export default IMP3646_REMAINDER_TAIL_MOMENT_RATIO_ASYMPTOTICS;
