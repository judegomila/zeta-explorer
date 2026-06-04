// @module data/imp-2361-erdos-turan-discrete-discrepancy-pcc-bypass
// imp-2361 -- FAN-OUT from imp-1315 (Koksma-Hlawka rate closure). The imp-1315
// audit showed that the Drmota-Tichy 1997 2nd-moment Koksma-Hlawka inequality
// cannot close the imp-1149 rateGap = 0.5 unconditionally: Leg A pays a
// structural O(N^{1/4}) Sobolev cost, and Leg B needs an L^2 star-discrepancy
// D_N^{*, L^2} = O(1 / N) that is EQUIVALENT to the Montgomery Pair Correlation
// Conjecture (Goldston-Montgomery 1987) and hence circular.
//
// THIS TICKET asks: do DISCRETE discrepancy measures -- the Erdos-Turan
// inequality, or low-discrepancy / Fibonacci (golden-ratio Kronecker) zero
// sampling -- offer a BYPASS of that PCC circularity, or do the discrete
// variants inherit the same obstruction? Numerical exploration only; NO proof
// claim and RH is NOT asserted.
//
// HEADLINE VERDICT
// ----------------
//   verdict = 'discrete-variants-inherit-the-obstruction'
//
// SUMMARY (one paragraph)
// -----------------------
// The discrete route does NOT bypass the obstruction; it inherits it twice over,
// via two independent floors that this file demonstrates numerically:
//
//   FLOOR 1 (Erdos-Turan is PCC-equivalent at the rate we need). The
//   Erdos-Turan inequality is an UPPER-bound tool: it bounds the star-
//   discrepancy D_N^* by a weighted sum of Weyl sums,
//     D_N^* <= 1 / (H + 1) + (C / N) * sum_{h=1}^{H} (1 / h) * |W_N(h)|,
//   W_N(h) = sum_{n=1}^{N} e(h u_n). To make the right-hand side O(1 / N) one
//   must take H of order N AND have |W_N(h)| = O(1) uniformly in h <= N (square-
//   root cancellation at EVERY frequency). For the unfolded xi zeros the Weyl
//   sums W_N(h) are, via the Riemann-von Mangoldt explicit formula, sums over
//   prime powers whose MEAN SQUARE over h is precisely the Montgomery pair-
//   correlation sum. So the all-frequency cancellation that Erdos-Turan would
//   need to deliver O(1 / N) is exactly PCC at unrestricted Fourier support --
//   the same circular input that blocked imp-1315 Leg B. Erdos-Turan reshuffles
//   the obstruction from the L^2 discrepancy onto the Weyl sums; it does not
//   remove it.
//
//   FLOOR 2 (the irregularities-of-distribution lower bound). Even granting an
//   IDEALLY equidistributed sequence -- which is what low-discrepancy / Fibonacci
//   sampling constructs -- the 1D star-discrepancy cannot beat (log N) / N. This
//   is Schmidt 1972 (Acta Arith. 21, 45-50): every infinite sequence in [0, 1)
//   has D_N^* > c * log N / N for infinitely many N, and the golden-ratio
//   Kronecker sequence {n * phi} ATTAINS this floor. So the O(1 / N) star-
//   discrepancy demanded by the rate closure is UNATTAINABLE by ANY sequence,
//   designed or otherwise -- the zeros do not even need to be the obstruction.
//   Low-discrepancy sampling is additionally INAPPLICABLE in principle: the
//   discrepancy we must bound is that of the GIVEN zero locations, which we are
//   not free to replace with a designed quadrature node set.
//
// This file builds the explicit golden-ratio Kronecker sequence (the canonical
// optimal 1D low-discrepancy sequence), computes its EXACT star-discrepancy and
// its Erdos-Turan upper bound at a ladder of N, and confirms numerically that
// BOTH decay like (log N) / N and NEITHER reaches O(1 / N): N * D_N^* GROWS with
// N rather than saturating, the signature of the log factor. That is the
// quantitative content of FLOOR 2, and it stands independently of the zeros.
//
// HONEST SCOPE
// ------------
// * No bound is loosened and Lambda is UNCHANGED at 3.06e-5. This is a negative
//   classification of one more candidate bypass, parallel to imp-1315 itself.
// * The golden-ratio Kronecker computation is a genuine self-contained numeric
//   witness for FLOOR 2 (the Schmidt 1972 floor). FLOOR 1 (the Erdos-Turan /
//   PCC equivalence) is documented and cross-referenced to the imp-1315 Leg B
//   obstruction; it is NOT re-derived here.
// * RH is NOT asserted. PCC at support > 1 remains OPEN.
//
// SYNTAX SAFETY
// -------------
// Line comments only (no JSDoc star-slash). Single-quoted strings only; no
// apostrophes inside single-quoted strings.

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1 -- The Erdos-Turan inequality (the discrete discrepancy tool tested).
// ─────────────────────────────────────────────────────────────────────────────
//
// ERDOS-TURAN 1948 (one standard normalization; Montgomery, Ten Lectures on the
// Interface of Analytic Number Theory and Harmonic Analysis, AMS 1994, Cor. 1.2;
// Kuipers-Niederreiter 1974, Uniform Distribution of Sequences, Theorem 2.5).
// For points u_1, ..., u_N in [0, 1) and any integer H >= 1,
//
//   D_N^* <= 1 / (H + 1) + (C_ET / N) * sum_{h=1}^{H} (1 / h) * |W_N(h)|,
//   W_N(h) = sum_{n=1}^{N} e(h u_n),    e(t) = exp(2 pi i t).
//
// The absolute constant C_ET depends on the normalization (3 in the form used
// here); the RATE conclusion below is constant-independent.

const C_ET = 3.0;

const ERDOS_TURAN_INEQUALITY = Object.freeze({
  statement:
    'D_N^* <= 1 / (H + 1) + (C_ET / N) * sum_{h=1}^{H} (1 / h) * |W_N(h)|',
  weylSum: 'W_N(h) = sum_{n=1}^{N} e(h u_n), e(t) = exp(2 pi i t)',
  constantC_ET: C_ET,
  constantIsNormalizationDependent: true,
  rateConclusionIsConstantIndependent: true,
  cite:
    'Erdos, P.; Turan, P. -- On a problem in the theory of uniform distribution I, II. ' +
    'Indag. Math. 10 (1948) 370-378, 406-413. Standard form: Montgomery, Ten Lectures ' +
    '(AMS Reg. Conf. Ser. 84, 1994) Cor. 1.2; Kuipers-Niederreiter 1974 Theorem 2.5.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 -- Build the canonical optimal 1D low-discrepancy sequence:
//           the golden-ratio Kronecker sequence u_n = frac(n * phi).
// ─────────────────────────────────────────────────────────────────────────────
//
// phi = (sqrt(5) - 1) / 2 is the most-badly-approximable irrational (continued
// fraction all-ones), so {n * phi} is the EXTREMAL 1D low-discrepancy sequence:
// it attains the Schmidt 1972 floor D_N^* = Theta(log N / N). Testing the
// discrete route on THIS sequence is the most favorable possible case -- if the
// optimal sequence cannot reach O(1 / N), no zero sequence can.

const PHI = (Math.sqrt(5) - 1) / 2;

function kroneckerPoints(N) {
  const u = new Float64Array(N);
  for (let n = 1; n <= N; n++) {
    const v = (n * PHI) % 1;
    u[n - 1] = v < 0 ? v + 1 : v;
  }
  return u;
}

// EXACT 1D star-discrepancy (Niederreiter 1992 eq. 2.5; Kuipers-Niederreiter
// Theorem 2.6): for sorted points u_(1) <= ... <= u_(N) in [0, 1),
//   D_N^* = 1 / (2 N) + max_{1 <= i <= N} | u_(i) - (2 i - 1) / (2 N) |.
function exactStarDiscrepancy(N) {
  const u = Array.from(kroneckerPoints(N)).sort((a, b) => a - b);
  let m = 0;
  for (let i = 1; i <= N; i++) {
    const d = Math.abs(u[i - 1] - (2 * i - 1) / (2 * N));
    if (d > m) m = d;
  }
  return 1 / (2 * N) + m;
}

// Erdos-Turan upper bound for the Kronecker sequence. The Weyl sum has the
// closed form |W_N(h)| = |sin(pi h phi N) / sin(pi h phi)| (geometric series),
// capped at N when the denominator is tiny (h phi near an integer).
function erdosTuranBound(N, H) {
  let s = 0;
  for (let h = 1; h <= H; h++) {
    const denom = Math.sin(Math.PI * h * PHI);
    let w;
    if (Math.abs(denom) < 1e-12) {
      w = N;
    } else {
      w = Math.abs(Math.sin(Math.PI * h * PHI * N) / denom);
      if (w > N) w = N;
    }
    s += w / h;
  }
  return 1 / (H + 1) + (C_ET / N) * s;
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 -- Numeric witnesses: compute true discrepancy + Erdos-Turan bound at
//           a ladder of N, with H = N (the most favorable Erdos-Turan cutoff).
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_N_VALUES = [200, 500, 1000, 2000, 5000];

const WITNESS_ROWS = SAMPLE_N_VALUES.map((N) => {
  const dStar = exactStarDiscrepancy(N);
  const etBound = erdosTuranBound(N, N);
  const logN = Math.log(N);
  return Object.freeze({
    N,
    dStar,
    etBound,
    // N * D_N^* -- if D_N^* were O(1 / N) this would SATURATE to a constant; if
    // D_N^* ~ (log N) / N it GROWS like log N. Growth is the FLOOR 2 signature.
    N_times_dStar: N * dStar,
    // Normalize by log N: N * D_N^* / log N stays bounded for a (log N) / N rate.
    N_times_dStar_over_logN: (N * dStar) / logN,
    // Erdos-Turan is a valid UPPER bound: etBound >= dStar must hold.
    etBoundIsUpperBound: etBound >= dStar - 1e-12,
    // The Erdos-Turan bound itself, times N, also fails to saturate.
    N_times_etBound: N * etBound,
  });
});

// FLOOR 2 numeric signatures, pinned for the tripwires.
const N_TIMES_DSTAR_FIRST = WITNESS_ROWS[0].N_times_dStar;
const N_TIMES_DSTAR_LAST = WITNESS_ROWS[WITNESS_ROWS.length - 1].N_times_dStar;
// Grows by more than 5 percent across the ladder -> NOT an O(1 / N) saturation.
const N_TIMES_DSTAR_GROWS = N_TIMES_DSTAR_LAST > N_TIMES_DSTAR_FIRST * 1.05;
// All Erdos-Turan evaluations are genuine upper bounds on the true discrepancy.
const ALL_ET_ARE_UPPER_BOUNDS = WITNESS_ROWS.every((r) => r.etBoundIsUpperBound);
// The log-normalized quantity stays in a bounded band -> consistent with the
// Theta(log N / N) Schmidt 1972 rate (it neither blows up nor decays to 0).
const LOGNORM_VALUES = WITNESS_ROWS.map((r) => r.N_times_dStar_over_logN);
const LOGNORM_MIN = Math.min(...LOGNORM_VALUES);
const LOGNORM_MAX = Math.max(...LOGNORM_VALUES);
const LOGNORM_IS_BANDED = LOGNORM_MIN > 0.05 && LOGNORM_MAX < 2.0;

// ─────────────────────────────────────────────────────────────────────────────
// STEP 4 -- The two floors, stated as named obstructions.
// ─────────────────────────────────────────────────────────────────────────────

const FLOOR_1_ERDOS_TURAN_PCC = Object.freeze({
  id: 'imp-2361-floor-1-erdos-turan-is-PCC-equivalent',
  label: 'Erdos-Turan to O(1/N) requires all-frequency Weyl cancellation = PCC',
  severity: 'research-grade-open',
  statement:
    'The Erdos-Turan inequality bounds D_N^* by 1 / (H + 1) + (C_ET / N) * ' +
    'sum_{h<=H} |W_N(h)| / h. Driving the RHS to O(1 / N) forces H ~ N AND ' +
    '|W_N(h)| = O(1) for all h <= N. For the unfolded xi zeros W_N(h) is, via ' +
    'the explicit formula, a prime-power sum whose mean square over h is the ' +
    'Montgomery pair-correlation function. Uniform |W_N(h)| = O(1) up to h ~ N ' +
    'is therefore PCC at unrestricted Fourier support -- OPEN (imp-1297 + ' +
    'imp-1302..imp-1310 exhaustion) -- the same circular input that blocks ' +
    'imp-1315 Leg B. Erdos-Turan moves the obstruction onto the Weyl sums; it ' +
    'does not eliminate it.',
  closes_if:
    'Montgomery PCC at unrestricted Fourier support (then Lambda = 0 trivially).',
  inheritsFrom: 'imp-1315-sub-goldston-montgomery-PCC-equivalence (Leg B)',
});

const FLOOR_2_SCHMIDT_LOWER_BOUND = Object.freeze({
  id: 'imp-2361-floor-2-schmidt-1972-1D-lower-bound',
  label: '1D star-discrepancy cannot beat (log N) / N for ANY sequence',
  severity: 'unconditional-floor',
  statement:
    'Schmidt 1972 (Acta Arith. 21, 45-50): every sequence in [0, 1) has ' +
    'D_N^* > c * log N / N for infinitely many N. The golden-ratio Kronecker ' +
    'sequence ATTAINS this floor. Hence the O(1 / N) star-discrepancy demanded ' +
    'by the rate closure is UNATTAINABLE by any sequence, designed or given -- ' +
    'independent of the zeros. Low-discrepancy / Fibonacci sampling is also ' +
    'inapplicable in principle, since the discrepancy we must bound is that of ' +
    'the FIXED zero locations, not a node set we may choose.',
  numericWitness:
    'N * D_N^* for {n * phi} GROWS across N in {200, 500, 1000, 2000, 5000} ' +
    'instead of saturating, the signature of the log N factor.',
  closes_if: 'Never (this is an unconditional irregularities-of-distribution floor).',
  cite: 'Schmidt, W. M. -- Irregularities of distribution VII. Acta Arith. 21 (1972) 45-50.',
});

// ─────────────────────────────────────────────────────────────────────────────
// STEP 5 -- Verdict + exported record.
// ─────────────────────────────────────────────────────────────────────────────

const ALLOWED_VERDICTS = Object.freeze([
  'discrete-variants-bypass-the-obstruction',
  'discrete-variants-inherit-the-obstruction',
  'discrete-variants-inconclusive',
]);

const VERDICT = 'discrete-variants-inherit-the-obstruction';

export const IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY = Object.freeze({
  id: 'imp-2361',
  ticket: 'imp-2361',
  title:
    'Discrete discrepancy measures (Erdos-Turan, golden-ratio Kronecker) do ' +
    'NOT bypass the Montgomery-PCC circularity of the Koksma-Hlawka rate route',
  builtAt: '2026-06-03T00:00:00Z',
  status: 'audited-with-named-obstructions',

  erdosTuranInequality: ERDOS_TURAN_INEQUALITY,
  goldenRatioPhi: PHI,
  sampleNValues: SAMPLE_N_VALUES,
  witnessRows: WITNESS_ROWS,

  witnessSummary: Object.freeze({
    N_times_dStar_first: N_TIMES_DSTAR_FIRST,
    N_times_dStar_last: N_TIMES_DSTAR_LAST,
    N_times_dStar_grows: N_TIMES_DSTAR_GROWS,
    allErdosTuranAreUpperBounds: ALL_ET_ARE_UPPER_BOUNDS,
    logNormalizedMin: LOGNORM_MIN,
    logNormalizedMax: LOGNORM_MAX,
    logNormalizedIsBanded: LOGNORM_IS_BANDED,
    interpretation:
      'On the EXTREMAL 1D low-discrepancy sequence {n * phi}, both the true ' +
      'star-discrepancy and its Erdos-Turan upper bound decay like (log N) / N, ' +
      'NOT O(1 / N): N * D_N^* grows across the ladder rather than saturating. ' +
      'This is the FLOOR 2 (Schmidt 1972) signature and it is independent of ' +
      'the zeros.',
  }),

  allowedVerdicts: ALLOWED_VERDICTS,
  verdict: VERDICT,
  namedObstructions: Object.freeze([FLOOR_1_ERDOS_TURAN_PCC, FLOOR_2_SCHMIDT_LOWER_BOUND]),

  crossReferences: Object.freeze({
    'imp-1315': 'src/data/imp-1315-koksma-hlawka-rate-closure.js (parent; Leg B PCC circularity that this fan-out probes)',
    'imp-1149': 'src/data/koksma-hlawka-2nd-moment-deviation-bound.js (rateGap = 0.5 source)',
    'imp-1297': 'src/data/imp-1297-conrey-snaith-pcc-attack.js (PCC at support > 1 open)',
  }),

  honestScope: Object.freeze({
    isAudit: true,
    isProof: false,
    bypassesObstruction: false,
    lambdaUnchanged: true,
    lambdaBound: 3.06e-5,
    rhAsserted: false,
    schmidtFloorIsUnconditional: true,
    erdosTuranFloorIsPCCEquivalent: true,
  }),
});

export default IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY;

// ─────────────────────────────────────────────────────────────────────────────
// BUILD-TIME TRIPWIRES (8 shipped).
// ─────────────────────────────────────────────────────────────────────────────

export const IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY_ASSERTIONS = [

  // Tripwire 1: Erdos-Turan inequality pinned with its Weyl-sum form + citation.
  {
    id: 'imp2361-erdos-turan-inequality-pinned',
    why:
      'The discrete tool under test is the Erdos-Turan inequality; its statement ' +
      '(D_N^* bounded by 1/(H+1) plus a weighted Weyl-sum tail) and citation must ' +
      'be present. Drift here means the audit lost its grounding tool.',
    holds: () => {
      const e = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY.erdosTuranInequality;
      return (
        typeof e.statement === 'string' &&
        /W_N\(h\)/.test(e.statement) &&
        /H \+ 1/.test(e.statement) &&
        typeof e.cite === 'string' &&
        /Erdos/.test(e.cite) &&
        /Turan/.test(e.cite) &&
        /1948/.test(e.cite)
      );
    },
  },

  // Tripwire 2: Verdict in the allowed set and equals the inherit-obstruction verdict.
  {
    id: 'imp2361-verdict-inherits-obstruction',
    why:
      'The numerical exploration concludes the discrete variants do NOT bypass ' +
      'the PCC circularity. The verdict must be in the allowed set and equal ' +
      'discrete-variants-inherit-the-obstruction. A flip to bypass without ' +
      'numeric support would be an overclaim.',
    holds: () => {
      const r = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY;
      return (
        r.allowedVerdicts.includes(r.verdict) &&
        r.verdict === 'discrete-variants-inherit-the-obstruction'
      );
    },
  },

  // Tripwire 3: Golden-ratio constant is correct (most-badly-approximable phi).
  {
    id: 'imp2361-golden-ratio-phi-correct',
    why:
      'The witness uses the EXTREMAL 1D low-discrepancy sequence {n * phi} with ' +
      'phi = (sqrt(5) - 1) / 2 approximately 0.6180339887. A wrong constant would ' +
      'no longer be the optimal sequence and the FLOOR 2 demonstration would be ' +
      'on a non-extremal case.',
    holds: () => {
      const phi = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY.goldenRatioPhi;
      return Number.isFinite(phi) && Math.abs(phi - 0.6180339887498949) < 1e-12;
    },
  },

  // Tripwire 4: FLOOR 2 numeric signature -- N * D_N^* GROWS across the ladder
  // (NOT an O(1/N) saturation), demonstrating the Schmidt 1972 log factor.
  {
    id: 'imp2361-floor2-N-times-dstar-grows',
    why:
      'The core numeric content: on the optimal 1D sequence, N * D_N^* grows ' +
      'with N instead of saturating to a constant, which is the signature of a ' +
      '(log N) / N rate (Schmidt 1972 floor) rather than the O(1 / N) the rate ' +
      'closure needs. If this fails the demonstration is empty.',
    holds: () => {
      const s = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY.witnessSummary;
      return (
        s.N_times_dStar_grows === true &&
        s.N_times_dStar_last > s.N_times_dStar_first
      );
    },
  },

  // Tripwire 5: every Erdos-Turan evaluation is a genuine UPPER bound (etBound >= dStar).
  {
    id: 'imp2361-erdos-turan-is-valid-upper-bound',
    why:
      'The Erdos-Turan inequality is an upper bound: at every sampled N the ' +
      'computed etBound must dominate the exact star-discrepancy. A violation ' +
      'would mean the implementation or constant is wrong and the audit numerics ' +
      'are untrustworthy.',
    holds: () => {
      const s = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY.witnessSummary;
      const rows = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY.witnessRows;
      return (
        s.allErdosTuranAreUpperBounds === true &&
        Array.isArray(rows) && rows.length >= 5 &&
        rows.every((r) => r.etBound >= r.dStar - 1e-12)
      );
    },
  },

  // Tripwire 6: log-normalized N * D_N^* stays in a bounded band -> Theta(log N / N).
  {
    id: 'imp2361-lognormalized-discrepancy-banded',
    why:
      'N * D_N^* / log N should remain in a bounded band across the ladder, ' +
      'consistent with the Theta(log N / N) Schmidt rate -- neither blowing up ' +
      '(super-log) nor decaying to 0 (which would wrongly suggest sub-log / ' +
      'O(1/N) behavior). This pins the RATE, not just monotonicity.',
    holds: () => {
      const s = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY.witnessSummary;
      return (
        s.logNormalizedIsBanded === true &&
        s.logNormalizedMin > 0.05 &&
        s.logNormalizedMax < 2.0
      );
    },
  },

  // Tripwire 7: two named floors present, both with the right IDs.
  {
    id: 'imp2361-two-named-floors',
    why:
      'The audit honesty content is the two floors: FLOOR 1 (Erdos-Turan to ' +
      'O(1/N) is PCC-equivalent, inheriting imp-1315 Leg B) and FLOOR 2 (Schmidt ' +
      '1972 unconditional 1D lower bound). Removing either would lose the dual ' +
      'reason the discrete route fails.',
    holds: () => {
      const obs = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY.namedObstructions;
      if (!Array.isArray(obs) || obs.length < 2) return false;
      const ids = new Set(obs.map((o) => o.id));
      return (
        ids.has('imp-2361-floor-1-erdos-turan-is-PCC-equivalent') &&
        ids.has('imp-2361-floor-2-schmidt-1972-1D-lower-bound')
      );
    },
  },

  // Tripwire 8: honest scope -- no bypass, Lambda unchanged, RH not asserted.
  {
    id: 'imp2361-honest-scope-no-bypass-lambda-unchanged',
    why:
      'SEMANTIC CHECK: this is a NEGATIVE classification. honestScope must record ' +
      'bypassesObstruction = false, lambdaUnchanged = true at 3.06e-5, and ' +
      'rhAsserted = false, consistent with the parent imp-1315 audit. An ' +
      'optimistic edit flipping bypassesObstruction to true without numeric ' +
      'support must fire this tripwire.',
    holds: () => {
      const hs = IMP_2361_ERDOS_TURAN_DISCRETE_DISCREPANCY.honestScope;
      return (
        hs.isAudit === true &&
        hs.isProof === false &&
        hs.bypassesObstruction === false &&
        hs.lambdaUnchanged === true &&
        Math.abs(hs.lambdaBound - 3.06e-5) < 1e-10 &&
        hs.rhAsserted === false
      );
    },
  },

];
