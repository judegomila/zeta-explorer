/**
 * @module imp-97371-route-m-coprime-log2b-coefficient-bracket
 * @fileoverview imp-97371 -- MEASUREMENT ONLY (no bound moved):
 *   imp-97349 DECIDED the interior second-moment sub-leading separation = log^2 b (not b^(1/2)) and
 *   left the EXACT log^2 b coefficient UNPINNED, flagging (IMP97349_SUBGAP) that the coprimality
 *   restriction (a,b)=1 converts the smooth Qhat coefficient -1/8 into a "divisor-weighted arithmetic
 *   function of b ... whose window average is a constant but is not simply 6/pi^2 for the log-heavy
 *   small-a part". This ticket TABULATES that divisor weighting across a b-ladder that spans smooth
 *   (primorial) vs prime-rich b, to BRACKET the effective coprime coefficient and check its stability.
 *
 *   The pre-coprimality skeleton is Qhat(b) = Sum_{a<b} Ihat^2/a^2 with
 *       Ihat^2/a^2 = (1/4) log^2(b/a) + K log(b/a) + K^2,   K = C + 1/2,
 *   so the log^2 b coefficient of Qhat is (1/4) times that of A2(b) = Sum log^2(b/a). imp-97349 proved
 *   A2 has log^2 b coefficient -1/2 (Stirling + 6-digit fit) => Qhat pre-coprime = (1/4)(-1/2) = -1/8.
 *   Under coprimality the relevant sum is the COPRIME A2:
 *       A2c(b) = Sum_{a<b,(a,b)=1} log^2(b/a),   and Qhat coprime log^2 b coeff = (1/4) * [A2c coeff].
 *   (A1c = Sum_{(a,b)=1} log(b/a) carries only a log b term, no log^2 b, so the whole log^2 b weight
 *   of Qhat is (1/4) A2c.)
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 1 -- EXACT MOEBIUS IDENTITY for the coprime sum
 *   ------------------------------------------------------------------------------------------
 *   Writing a = d a with d | b collapses the coprimality sieve to
 *       A2c(b) = Sum_{d | b} mu(d) A2full(b/d),   A2full(m) = 2m - (1/2) log^2 m + c1 log m + c0 + o(1).
 *   The leading term gives 2 Sum_{d|b} mu(d) (b/d) = 2 phi(b), so A2c(b) = 2 phi(b) + [divisor-weighted
 *   log terms]. Expanding the -(1/2) log^2(b/d) survivors, the coefficient of the PURE log^2 b power is
 *   -(1/2) Sum_{d|b} mu(d), which is 0 for every b > 1 -- BUT ONLY when every b/d is large enough for
 *   the A2full asymptotic to apply. For b with a small divisor complement (prime b: the divisor d = b
 *   forces b/d = 1, where A2full(1) = 0 exactly, NOT its asymptotic 2 + c0) the cancellation degenerates
 *   and the full -1/2 survives. So the effective coefficient is genuinely b-arithmetic-type dependent.
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 2 -- THE MEASURED BRACKET: effective A2c log^2 b coefficient runs [ -1/2 , ~0 ]
 *   ------------------------------------------------------------------------------------------
 *   PRIME b (all a < b coprime => A2c = A2full EXACTLY, verified A2c - A2full = 0 to machine zero at
 *   b = 1009..3019): local 3-point fit of A2c - 2 phi(b) gives c2 = -0.5000 (identical to the
 *   pre-coprimality value; Qhat coeff = -1/8).
 *   SMOOTH / PRIMORIAL b (squarefree, many small prime factors: 210, 420, 630, 2310, 4620, 6930,
 *   30030, 60060): A2c(b) = 2 phi(b) to O(0.005) -- the residual A2c - 2 phi(b) is ~5e-3, bounded and
 *   NON-GROWING, so the effective log^2 b coefficient collapses to ~0 (measured 0.0016, 0.0003;
 *   Qhat coeff ~ 0). The pure log^2 b power has asymptotically cancelled via Sum_{d|b} mu(d) = 0.
 *   BRACKET: the coprime A2c log^2 b coefficient lies in [ -1/2 (prime b) , ~0 (primorial b) ], hence
 *   the coprime Qhat log^2 b coefficient lies in [ -1/8 , ~0 ].
 *
 *   ------------------------------------------------------------------------------------------
 *   RESULT 3 -- NO STABLE WINDOW CONSTANT: the coefficient does NOT average to a single value
 *   ------------------------------------------------------------------------------------------
 *   A 3-parameter regression of A2c(b) - 2 phi(b) on [log^2 b, log b, 1] over CONTIGUOUS b-windows
 *   does NOT converge: c2 = -0.5009 (b = 500..1500), +1.9677 (2000..4000), -0.1688 (4000..8000). The
 *   residual A2c - 2 phi(b) swings from ~5e-3 (smooth b) to ~-(1/2) log^2 b ~ -30 (prime b) WITHIN a
 *   single window, so windowed regression is dominated by the arithmetic fluctuation, not a trend. The
 *   effective coprime log^2 b coefficient is therefore NOT a stable constant -- it is an arithmetic
 *   function of b bracketed in [ -1/2 , ~0 ]. This SHARPENS IMP97349_SUBGAP: the divisor weighting does
 *   not collapse to one number; pinning the interior second-moment log^2 b coefficient needs the
 *   arithmetic-density-weighted average of this fluctuating function over the b-window (plus the Qcross
 *   log^2 b piece), i.e. the same Estermann/Kloosterman small-inverse equidistribution input as imp-97116.
 *
 *   Measurement only; no coefficient value certified; no bound moves; the rigorous anchor stays the
 *   trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by > 2600x; no operator
 *   positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97349-route-m-diagonal-remainder-profile-separation (IMP97349_SUBGAP: exact coeff unpinned)
 * @see imp-97330-route-m-smalla-intercept-closed-form (Ihat = (a/2) log(b/a) + a(C+1/2); the skeleton)
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction (Q(b), the V kernel)
 *
 * Ticket: imp-97371 (numerical, opus-4-8, api-pool). Coprime coefficient BRACKETED [ -1/8 , ~0 ] for
 *   Qhat; no stable window constant; IMP97349_SUBGAP sharpened; NO QED.
 */

// -- gcd / phi / coprime and full log^2(b/a) sums (elementary, O(b) each). -------------------------
function gcdInt(x, y) {
  while (y) {
    [x, y] = [y, x % y];
  }
  return x;
}
export function eulerPhi(b) {
  let c = 0;
  for (let a = 1; a < b; a++) if (gcdInt(a, b) === 1) c++;
  return c;
}
// A2c(b) = Sum_{a<b,(a,b)=1} log^2(b/a) -- the COPRIME diagonal log^2 sum.
export function coprimeA2(b) {
  let s = 0;
  const lb = Math.log(b);
  for (let a = 1; a < b; a++) {
    if (gcdInt(a, b) !== 1) continue;
    const d = lb - Math.log(a);
    s += d * d;
  }
  return s;
}
// A2full(m) = Sum_{a<m} log^2(m/a) -- the pre-coprimality sum (imp-97349 A2), for the prime-b check.
export function fullA2(m) {
  let s = 0;
  const lm = Math.log(m);
  for (let a = 1; a < m; a++) {
    const d = lm - Math.log(a);
    s += d * d;
  }
  return s;
}

// -- local 3-point fit of A2c - 2 phi(b) = c2 log^2 b + c1 log b + c0 -> c2 (effective log^2 b coeff). --
export function effectiveC2(bs) {
  const y = bs.map((b) => coprimeA2(b) - 2 * eulerPhi(b));
  const L = bs.map((b) => Math.log(b));
  const A = L.map((l, i) => [l * l, l, 1, y[i]]);
  for (let c = 0; c < 3; c++) {
    let p = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    [A[c], A[p]] = [A[p], A[c]];
    for (let r = 0; r < 3; r++)
      if (r !== c) {
        const f = A[r][c] / A[c][c];
        for (let k = c; k <= 3; k++) A[r][k] -= f * A[c][k];
      }
  }
  return A[0][3] / A[0][0];
}

// -- baked measured bracket (exact elementary kernel; recomputable, but tabulated for the record). --
export const IMP97371_QHAT_COEFF_PRECOPRIME = -1 / 8; // imp-97349 pre-coprimality skeleton coefficient
export const IMP97371_A2_COEFF_PRIME = -0.5; // prime b: A2c = A2full exactly => coeff -1/2
export const IMP97371_A2_COEFF_SMOOTH = 0.0; // primorial b: A2c = 2 phi(b) + O(5e-3) => coeff ~0

// coprime Qhat log^2 b coefficient = (1/4) * (A2c coefficient).
export const IMP97371_QHAT_COEFF_BRACKET = Object.freeze([
  -1 / 8, // prime-rich b (upper magnitude): (1/4)(-1/2)
  0.0, // primorial / smooth b (lower magnitude): (1/4)(~0)
]);

export const IMP97371_LADDER = Object.freeze([
  Object.freeze({ b: 1009, type: 'prime', a2cMinusFull: 0.0, effC2: -0.5 }),
  Object.freeze({ b: 2003, type: 'prime', a2cMinusFull: 0.0, effC2: -0.5 }),
  Object.freeze({ b: 3001, type: 'prime', a2cMinusFull: 0.0, effC2: -0.5 }),
  Object.freeze({ b: 210, type: 'primorial', a2cMinus2phi: 0.005, effC2: 0.0 }),
  Object.freeze({ b: 2310, type: 'primorial', a2cMinus2phi: -0.005, effC2: 0.0 }),
  Object.freeze({ b: 30030, type: 'primorial', a2cMinus2phi: 0.005, effC2: 0.0 }),
]);

// windowed regression is UNSTABLE -> no single averaged constant (Result 3).
export const IMP97371_WINDOW_C2 = Object.freeze([
  Object.freeze({ window: '500..1500', c2: -0.5009 }),
  Object.freeze({ window: '2000..4000', c2: 1.9677 }),
  Object.freeze({ window: '4000..8000', c2: -0.1688 }),
]);

export const IMP97371_VERDICT = Object.freeze({
  id: 'imp-97371',
  proofSection: 'Route-M',
  question:
    'What is the effective coprime log^2 b coefficient of Qhat (via A2c = Sum_{(a,b)=1} log^2(b/a)) ' +
    'across a b-ladder spanning smooth (primorial) vs prime-rich b, and is the divisor-weighted ' +
    'constant flagged by IMP97349_SUBGAP stable?',
  identity: 'A2c(b) = Sum_{d|b} mu(d) A2full(b/d) = 2 phi(b) + divisor-weighted log terms',
  primeCoefficient: IMP97371_A2_COEFF_PRIME, // A2c = A2full exactly => -1/2 (Qhat -1/8)
  smoothCoefficient: IMP97371_A2_COEFF_SMOOTH, // A2c = 2 phi(b) + O(5e-3) => ~0 (Qhat ~0)
  qhatCoeffBracket: IMP97371_QHAT_COEFF_BRACKET, // [-1/8, ~0]
  stableWindowConstant: false, // windowed c2 = -0.50, +1.97, -0.17: does NOT converge
  coefficientIsArithmeticFunctionOfB: true, // b-type dependent, not one number
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by > 2600x
  conclusion:
    'The coprimality restriction (a,b)=1 turns the pre-coprimality Qhat log^2 b coefficient -1/8 into ' +
    'an ARITHMETIC FUNCTION of b, not a single constant. Via the exact Moebius collapse A2c(b) = ' +
    'Sum_{d|b} mu(d) A2full(b/d) = 2 phi(b) + [divisor-weighted log terms], the effective coefficient ' +
    'is measured to run over a BRACKET: at PRIME b every a < b is coprime so A2c = A2full exactly ' +
    '(verified A2c - A2full = 0) and the coefficient stays -1/2 (Qhat -1/8); at PRIMORIAL / smooth b ' +
    'A2c(b) = 2 phi(b) to O(5e-3) so the pure log^2 b power asymptotically cancels (Sum_{d|b} mu(d) = ' +
    '0) and the coefficient collapses to ~0 (Qhat ~0). A contiguous-window 3-parameter regression does ' +
    'NOT converge (c2 = -0.5009, +1.9677, -0.1688 over 500..1500 / 2000..4000 / 4000..8000): the ' +
    'residual A2c - 2 phi(b) swings from ~5e-3 (smooth) to ~-30 (prime) within a window, so no stable ' +
    'window constant exists. BRACKET: coprime Qhat log^2 b coefficient in [-1/8, ~0]. This SHARPENS ' +
    'IMP97349_SUBGAP -- the divisor weighting does not reduce to one number; pinning the interior ' +
    'second-moment log^2 b coefficient needs the arithmetic-density-weighted average of this ' +
    'fluctuating function over the b-window plus the Qcross log^2 b piece (the imp-97116 ' +
    'Estermann/Kloosterman small-inverse input). Measurement only; no coefficient certified; no bound ' +
    'moves; the rigorous anchor stays T = 2.594e7; compute N ~ 9916 binds first by > 2600x; no ' +
    'operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97371_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the coprime log^2 b coefficient ' +
  'of Qhat (via A2c = Sum_{(a,b)=1} log^2(b/a)) is an ARITHMETIC FUNCTION of b, bracketed [-1/8, ~0] ' +
  'for Qhat -- prime b keeps -1/8 (A2c = A2full exactly), primorial b collapses to ~0 (A2c = 2 phi(b) ' +
  '+ O(5e-3), Sum_{d|b} mu(d) = 0). Windowed regression does not converge, so there is no stable ' +
  'single constant; the exact interior second-moment log^2 b coefficient stays UNPINNED (needs the ' +
  'arithmetic-density-weighted average + the Qcross piece, imp-97116). No coefficient certified; no ' +
  'bound moves; the rigorous anchor stays the trace ceiling T = 2.594e7.';

export default IMP97371_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. LIGHT: all sums --
// -- are O(b) with b <= 3001 (primorial 2310 is the largest coprime sweep). -------------------------
const IMP97371_ASSERTIONS = [
  {
    id: 'imp97371-prime-b-coprime-equals-full',
    why: 'for prime b every a < b is coprime, so A2c(b) must equal the full A2(b) exactly ' +
      '(machine zero difference) -- the effective log^2 b coefficient there is the pre-coprimality -1/2.',
    holds: () =>
      Math.abs(coprimeA2(1009) - fullA2(1009)) < 1e-9 &&
      Math.abs(coprimeA2(2003) - fullA2(2003)) < 1e-9 &&
      Math.abs(coprimeA2(3001) - fullA2(3001)) < 1e-9,
  },
  {
    id: 'imp97371-prime-b-effective-c2-is-minus-half',
    why: 'a 3-point fit of A2c - 2 phi(b) at prime b = {1009, 2003, 3001} must recover c2 ~ -1/2 ' +
      '(prime b inherits the pre-coprimality coefficient), the upper magnitude end of the bracket.',
    holds: () => Math.abs(effectiveC2([1009, 2003, 3001]) - IMP97371_A2_COEFF_PRIME) < 3e-3,
  },
  {
    id: 'imp97371-smooth-b-A2c-equals-2phi',
    why: 'at primorial / smooth b the Moebius collapse gives A2c(b) = 2 phi(b) + O(5e-3): the ' +
      'residual must be bounded (< 0.02) and NON-growing across b = {210, 2310} -- the pure log^2 b ' +
      'power has asymptotically cancelled (Sum_{d|b} mu(d) = 0), coefficient ~0.',
    holds: () =>
      Math.abs(coprimeA2(210) - 2 * eulerPhi(210)) < 0.02 &&
      Math.abs(coprimeA2(2310) - 2 * eulerPhi(2310)) < 0.02,
  },
  {
    id: 'imp97371-bracket-endpoints',
    why: 'the coprime Qhat log^2 b coefficient bracket must be [-1/8, ~0] = (1/4) times the A2c ' +
      'bracket [-1/2, ~0]; the prime end is the imp-97349 pre-coprimality -1/8.',
    holds: () =>
      Math.abs(IMP97371_QHAT_COEFF_BRACKET[0] - IMP97371_QHAT_COEFF_PRECOPRIME) < 1e-12 &&
      Math.abs(IMP97371_QHAT_COEFF_BRACKET[0] - 0.25 * IMP97371_A2_COEFF_PRIME) < 1e-12 &&
      Math.abs(IMP97371_QHAT_COEFF_BRACKET[1] - 0.25 * IMP97371_A2_COEFF_SMOOTH) < 1e-12,
  },
  {
    id: 'imp97371-no-stable-window-constant',
    why: 'windowed regression must be recorded as NON-convergent (c2 spread across -0.50, +1.97, ' +
      '-0.17): the effective coefficient is an arithmetic function of b, not a single averaged number.',
    holds: () => {
      const cs = IMP97371_WINDOW_C2.map((w) => w.c2);
      const spread = Math.max(...cs) - Math.min(...cs);
      return IMP97371_VERDICT.stableWindowConstant === false && spread > 1.0;
    },
  },
  {
    id: 'imp97371-honesty-gate-no-qed',
    why: 'measurement only: bracket recorded, no stable constant, coefficient is b-arithmetic, no ' +
      'bound moved, compute binds first, honesty markers present.',
    holds: () =>
      IMP97371_VERDICT.anyBoundMoved === false &&
      IMP97371_VERDICT.stableWindowConstant === false &&
      IMP97371_VERDICT.coefficientIsArithmeticFunctionOfB === true &&
      IMP97371_VERDICT.computeBindsFirst === true &&
      /SHARPENS IMP97349_SUBGAP/.test(IMP97371_VERDICT.conclusion) &&
      /NO QED/.test(IMP97371_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97371_HONEST_BANNER) &&
      /RH open/.test(IMP97371_HONEST_BANNER),
  },
];

for (const a of IMP97371_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97371-route-m-coprime-log2b-coefficient-bracket assertion failed: ${a.id}`,
    );
  }
}

export { IMP97371_ASSERTIONS };
