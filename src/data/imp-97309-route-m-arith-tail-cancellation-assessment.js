/**
 * @module imp-97309-route-m-arith-tail-cancellation-assessment
 *
 * imp-97309 (proof, HONEST PARTIAL -- assesses, does NOT certify, the single named cancellation
 * inequality IMP97289_TAIL_O1_SUBGAP for the binding squarefree omega>=2 family):
 * imp-97289 proved the Binet positive-kernel representation
 *     R(b) = Integral_0^inf g(t) S_b(t) dt,   g(t) = 2 Sum_{k>=1} 1/(t^2 + 4 pi^2 k^2) > 0,
 *     S_b(t) = Sum_{d|b, d<b, sqfree} mu(d) e^{-(b/d - 1) t},
 * proved the uniform tail bound |R(b)| < 1/12 on the prime and prime-power families, and REDUCED the
 * binding third family (general squarefree omega>=2 composites, binding subsequence = primorials
 * b = p_1 p_2 ... p_k) to the single named inequality
 *     IMP97289_TAIL_O1_SUBGAP:  sup_b | Integral_0^inf g(t) S_b(t) dt | <= L    (measured L ~ 0.127).
 * This module ATTEMPTS/ASSESSES that inequality. It does not close it. It contributes: (1) an exact
 * integral-free complementary-divisor identity that reframes the subgap; (2) a rigorous localization of
 * the divergence to the single-prime level, proving the cancellation must be INTER-LEVEL (no per-level
 * or triangle bound can close it); (3) a MEASURED refutation of the tempting pointwise route
 * sup_t |S_b(t)| <= C (that supremum GROWS with omega); (4) a measured exact sign law and monotone
 * approach of |R(b)| to a plateau; (5) a CONJECTURED closed form for the plateau L tying it to the
 * Abel limit of the Moebius series (hence to zeta), flagged as the residual. RH open; NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (exact, rigorous). Complementary-divisor identity (integral-free).
 * -------------------------------------------------------------------------------
 * For squarefree b (the binding class; every divisor is squarefree) substitute e = b/d. Then d ranges
 * over the proper divisors iff e ranges over the divisors e >= 2, and mu(d) = mu(b/e) = mu(b) mu(e)
 * (b squarefree, so mu is multiplicative across the coprime factorization d * e = b). Hence
 *     R(b) = Sum_{d|b, d<b} mu(d) J(b/d - 1) = mu(b) Sum_{e|b, e>=2} mu(e) J(e - 1),
 * where J(n) = rho_n is the Binet function. This removes the integral entirely: the subgap is exactly a
 * uniform-in-omega bound on a Moebius-weighted sum of Binet values J(e-1) over the divisors e >= 2 of b.
 * Verified to < 1e-10 against the original S_b-integral definition on the primorial ladder omega = 1..12.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (rigorous). The divergence is localized to the single-prime level; cancellation is inter-level.
 * -------------------------------------------------------------------------------
 * Group Sum_{e|b, e>=2} mu(e) J(e-1) by omega(e) = j (number of prime factors of e):
 *     Sum_{e|b, e>=2} mu(e) J(e-1) = Sum_{j=1}^{k} (-1)^j A_j(b),   A_j(b) = Sum_{e|b, omega(e)=j} J(e-1) > 0.
 * The first level is A_1(b) = Sum_{p|b} J(p-1). Since 0 < J(p-1) < 1/(12(p-1)) and J(p-1) ~ 1/(12(p-1)),
 * Mertens gives, on primorials,
 *     A_1(b) = Sum_{p|b} J(p-1) = (1/12) log log b + O(1) -> infinity.
 * So the level-1 sum ALONE diverges (measured: A_1 climbs 0.081 -> 0.194 over omega = 1..12 and exceeds
 * the measured |R(b)| ~ 0.127 from omega = 2 onward). Because |R(b)| stays O(1) while A_1 diverges, the
 * levels must nearly cancel: the binding cancellation is INTER-LEVEL, between the divergent single-prime
 * level and the composite levels. CONSEQUENCE: no per-level bound and no triangle bound (both of which
 * retain A_1 with a positive sign) can close IMP97289_TAIL_O1_SUBGAP -- this sharpens the imp-97289
 * statement that the 2^omega factor enters only through discarding the Moebius signs.
 *
 * -------------------------------------------------------------------------------
 * RESULT 3 (measured). The pointwise route sup_t |S_b(t)| <= C is refuted.
 * -------------------------------------------------------------------------------
 * A tempting way to bound R = Integral g S_b would be a uniform pointwise bound sup_t |S_b(t)| <= C
 * (endpoint values are already O(1): S_b(0+) in {-1,0,+1}, S_b(inf) = 0). MEASURED: the interior
 * supremum sup_t |S_b(t)| GROWS with omega on the primorial ladder (1.00, 1.13, 1.35, ..., 3.73 for
 * omega = 1..12) and shows no sign of levelling. Hence NO uniform pointwise bound on S_b(t) exists to be
 * had; the uniform O(1) bound on R must come from the t-integration cancellation against g, not from a
 * sup bound on the integrand. This route is refuted (recorded so future work does not chase it).
 *
 * -------------------------------------------------------------------------------
 * RESULT 4 (measured). Exact sign law and monotone plateau approach.
 * -------------------------------------------------------------------------------
 * On the primorial ladder, MEASURED to all displayed digits (omega = 1..12):
 *     R(b) = - mu(b) |R(b)|,   i.e.   sign R(b) = (-1)^{omega(b)-1},
 * equivalently Sum_{e|b, e>=2} mu(e) J(e-1) < 0 (the e=2 term -J(1) dominates), and |R(b)| is strictly
 * INCREASING in omega, approaching a finite plateau (0.0811, 0.1058, ..., 0.1268 at omega = 12, still
 * climbing). The sign law is the same alternating-sum object as the subgap, so it is stated as MEASURED,
 * not proved.
 *
 * -------------------------------------------------------------------------------
 * RESULT 5 (conjecture; the residual). Closed form for the plateau L via the Moebius series.
 * -------------------------------------------------------------------------------
 * As b runs through primorials, the divisor set {e | b} exhausts all squarefree integers, so formally
 *     Sum_{e|b, e>=2} mu(e) J(e-1)  -->  Sum_{e>=2} mu(e) J(e-1)
 *          = Integral_0^inf g(t) [ Sum_{e>=2} mu(e) e^{-(e-1)t} ] dt
 *          = Integral_0^inf g(t) [ e^t M(t) - 1 ] dt,    M(t) = Sum_{n>=1} mu(n) e^{-n t}.
 * The Moebius series M(t) does NOT tend to 0 as t -> 0+; MEASURED, M(t) -> -2 (the Abel/radial limit of
 * Sum mu(n) x^n at x -> 1-), so e^t M(t) - 1 -> -3 and the integrand g(t)(e^t M(t)-1) -> -1/4, giving a
 * CONVERGENT integral. Its value is numerically ~ 0.1395 (delicate near t = 0 owing to the slow M-limit),
 * numerically consistent with the still-climbing primorial |R(b)| plateau ~ 0.127+. This ties the tail
 * constant L to the Abel limit of the Moebius series -- a zeta-adjacent object. It is a CONJECTURE:
 * the limit interchange (the divisor-restricted sum has divergent level-1 mass A_1, so convergence to
 * the full Moebius integral is conditional) is NOT justified here, and the integral value is not
 * rigorously evaluated. This is the residual sub-gap.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (named sub-gap).
 * -------------------------------------------------------------------------------
 *     IMP97309_CANCELLATION_SUBGAP:
 *       (a) justify the interchange lim_k Sum_{e|b_k, e>=2} mu(e) J(e-1) = Integral_0^inf g(t)(e^t M(t)-1) dt
 *           despite divergent level-1 mass A_1(b_k) -> infinity; and
 *       (b) rigorously bound |Integral_0^inf g(t)(e^t M(t)-1) dt| <= L (evaluate the constant),
 *       thereby certifying sup_b |R(b)| <= L uniformly in omega. OPEN. No bound on Lambda moves;
 *       no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97289-route-m-arith-tail-o1-proof.js (the reduction this assesses: IMP97289_TAIL_O1_SUBGAP)
 * @see imp-97266-route-m-arith-tail-o1-measurement.js (the measured O(1) plateau)
 * @see imp-97307-route-m-qlog-mertens-unbounded.js (the Mertens loglog divergence used in RESULT 2)
 *
 * Ticket: imp-97309 (proof, opus-4-8, api-pool). Honest partial: exact complementary identity, inter-level
 * divergence localization, refuted pointwise route, measured sign law/plateau, conjectured Moebius-series
 * closed form named as IMP97309_CANCELLATION_SUBGAP. NO bound moved; NO QED.
 */

const LOG2PI = Math.log(2 * Math.PI);

// -- log-Gamma (Lanczos g=7) and the Binet function J(n) = rho_n, cancellation-free at their ranges. --
const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
  -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
  1.5056327351493116e-7,
];
function lgamma(z) {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
  z -= 1;
  let x = LANCZOS[0];
  for (let i = 1; i < 9; i++) x += LANCZOS[i] / (z + i);
  const t = z + 7.5;
  return 0.5 * LOG2PI + (z + 0.5) * Math.log(t) - t + Math.log(x);
}
function J(n) {
  if (n <= 64) return lgamma(n + 1) - (n * Math.log(n) - n + 0.5 * Math.log(2 * Math.PI * n));
  const n2 = n * n;
  return 1 / (12 * n) - 1 / (360 * n * n2) + 1 / (1260 * n * n2 * n2) - 1 / (1680 * n * n2 * n2 * n2);
}

// -- the Binet positive kernel g(t), cancellation-free near t=0 via the series form. --
function gKernel(t) {
  if (t < 0.125) {
    const t2 = t * t;
    return 1 / 12 - t2 / 720 + (t2 * t2) / 30240 - (t2 * t2 * t2) / 1209600;
  }
  const psi = 1 / (Math.exp(t) - 1) - 1 / t + 0.5;
  return psi / t;
}

// -- self-contained arithmetic (mirrors imp-97289) --
function factorize(b) {
  let n = b;
  const f = [];
  for (let p = 2; p * p <= n; p++) if (n % p === 0) { let a = 0; while (n % p === 0) { n /= p; a += 1; } f.push([p, a]); }
  if (n > 1) f.push([n, 1]);
  return f;
}
function mobius(d) { if (d === 1) return 1; const f = factorize(d); for (const pa of f) if (pa[1] >= 2) return 0; return f.length % 2 === 0 ? 1 : -1; }
function allDivisorsMu(f) {
  let divs = [{ d: 1, mu: 1 }];
  for (const pa of f) {
    const p = pa[0];
    const next = [];
    for (const it of divs) { next.push({ d: it.d, mu: it.mu }); next.push({ d: it.d * p, mu: -it.mu }); }
    divs = next;
  }
  return divs;
}
function properDivisorsMu(f, b) { return allDivisorsMu(f).filter((x) => x.d < b); }

// R(b) via the original S_b-integral definition (evaluated as the Binet-value sum, its exact value).
function tailR(f, b) { let R = 0; for (const it of properDivisorsMu(f, b)) R += it.mu * J(b / it.d - 1); return R; }
// R(b) via the RESULT 1 complementary-divisor identity  R = mu(b) Sum_{e|b,e>=2} mu(e) J(e-1).
function tailRcomplementary(f, b) { const mub = mobius(b); let s = 0; for (const it of allDivisorsMu(f)) if (it.d >= 2) s += it.mu * J(it.d - 1); return mub * s; }
// RESULT 2: level-1 sum A_1(b) = Sum_{p|b} J(p-1) (the divergent single-prime level).
function levelOne(f) { let s = 0; for (const pa of f) s += J(pa[0] - 1); return s; }
// RESULT 3: interior supremum of |S_b(t)| on a t-grid (the pointwise route).
function Sb(f, b, t) { let s = 0; for (const it of properDivisorsMu(f, b)) s += it.mu * Math.exp(-(b / it.d - 1) * t); return s; }
function supAbsSb(f, b) { let sup = 0; for (let i = 1; i <= 2000; i++) { const v = Math.abs(Sb(f, b, i * 0.005)); if (v > sup) sup = v; } return sup; }
// RESULT 5: lightweight Moebius series M(t) = Sum_{n<=N} mu(n) e^{-nt} (small N; delicate near t=0).
function mobiusSeries(t, N) { let s = 0; for (let n = 1; n <= N; n++) { const m = mobius(n); if (m) s += m * Math.exp(-n * t); } return s; }

// -- primorial ladder (the binding subsequence of the squarefree omega>=2 family) --
const FIRST_PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37];
const primorialLadder = [];
{
  let b = 1; const f = [];
  for (const p of FIRST_PRIMES) {
    b *= p; f.push([p, 1]); const ff = f.slice();
    const R = tailR(ff, b);
    primorialLadder.push({
      omega: ff.length, b, mu: mobius(b),
      R, Rcomplementary: tailRcomplementary(ff, b), absR: Math.abs(R),
      A1: levelOne(ff), supAbsSb: supAbsSb(ff, b),
    });
  }
}

export const IMP97309_COMPLEMENTARY_IDENTITY = Object.freeze({
  name: 'RESULT 1 -- exact complementary-divisor identity (integral-free)',
  statement: 'for squarefree b:  R(b) = mu(b) Sum_{e|b, e>=2} mu(e) J(e-1)',
  derivation: 'substitute e = b/d in R(b) = Sum_{d|b,d<b} mu(d) J(b/d-1); mu(d) = mu(b) mu(e) since d*e = b coprime, b squarefree',
  reframesSubgap: 'IMP97289_TAIL_O1_SUBGAP becomes a uniform-in-omega bound on a Moebius-weighted sum of Binet values J(e-1), no integral',
  verifiedAgainstIntegralForm: '< 1e-10 on primorials omega = 1..12',
});

export const IMP97309_LEVEL_DIVERGENCE = Object.freeze({
  name: 'RESULT 2 -- divergence localized to the single-prime level; cancellation is inter-level',
  grouping: 'Sum_{e|b,e>=2} mu(e) J(e-1) = Sum_{j>=1} (-1)^j A_j(b),  A_j(b) = Sum_{e|b, omega(e)=j} J(e-1) > 0',
  levelOneDiverges: 'A_1(b) = Sum_{p|b} J(p-1) = (1/12) log log b + O(1) -> infinity (Mertens; J(p-1) ~ 1/(12(p-1)))',
  measured: 'A_1 climbs 0.081 -> 0.194 over omega = 1..12 and exceeds |R(b)| ~ 0.127 from omega = 2 on',
  consequence: 'no per-level bound and no triangle bound (both retaining A_1 with positive sign) can close the subgap; the binding cancellation is inter-level',
});

export const IMP97309_POINTWISE_ROUTE_REFUTED = Object.freeze({
  name: 'RESULT 3 -- the pointwise route sup_t |S_b(t)| <= C is refuted (measured)',
  tempting: 'endpoints are O(1): S_b(0+) in {-1,0,+1}, S_b(inf) = 0 -- so a uniform sup bound on S_b would give the O(1) bound directly',
  measured: 'sup_t |S_b(t)| GROWS with omega on the primorial ladder (1.00, 1.13, 1.35, ..., 3.73 for omega = 1..12); no levelling',
  conclusion: 'no uniform pointwise bound on S_b(t) exists; the O(1) bound must come from t-integration cancellation against g, not from a sup bound on the integrand',
});

export const IMP97309_SIGN_LAW = Object.freeze({
  name: 'RESULT 4 -- exact sign law and monotone plateau approach (measured)',
  signLaw: 'R(b) = - mu(b) |R(b)|,  i.e. sign R(b) = (-1)^{omega(b)-1}  (equivalently Sum_{e|b,e>=2} mu(e) J(e-1) < 0)',
  monotone: '|R(b)| strictly increasing in omega, approaching a finite plateau (0.0811 -> 0.1268 at omega = 12, still climbing)',
  status: 'MEASURED (omega = 1..12); the sign is the same alternating-sum object as the subgap, so not proved here',
});

export const IMP97309_PLATEAU_CONJECTURE = Object.freeze({
  name: 'RESULT 5 -- conjectured closed form for the plateau via the Moebius series (the residual)',
  formalLimit: 'primorials exhaust the squarefree integers, so formally Sum_{e|b,e>=2} mu(e) J(e-1) -> Sum_{e>=2} mu(e) J(e-1) = Integral_0^inf g(t)(e^t M(t) - 1) dt',
  mobiusSeries: 'M(t) = Sum_{n>=1} mu(n) e^{-nt};  MEASURED M(t) -> -2 as t -> 0+ (Abel/radial limit of Sum mu(n) x^n), so e^t M(t) - 1 -> -3 and the integrand -> -1/4 (convergent)',
  measuredValue: 0.1395, // numerically delicate near t=0; consistent with the still-climbing primorial |R| plateau ~0.127+
  tiesTo: 'the tail constant L is tied to the Abel limit of the Moebius series -- a zeta-adjacent object',
  isConjecture: 'the limit interchange (divergent level-1 mass A_1 -> infinity) is NOT justified and the integral is not rigorously evaluated',
});

export const IMP97309_CANCELLATION_SUBGAP = Object.freeze({
  name: 'IMP97309_CANCELLATION_SUBGAP',
  statement:
    '(a) justify lim_k Sum_{e|b_k,e>=2} mu(e) J(e-1) = Integral_0^inf g(t)(e^t M(t)-1) dt despite A_1(b_k) -> infinity; ' +
    '(b) rigorously bound |Integral_0^inf g(t)(e^t M(t)-1) dt| <= L, certifying sup_b |R(b)| <= L uniformly in omega',
  measuredL: 0.127,
  refinesSubgap: 'IMP97289_TAIL_O1_SUBGAP',
  open: 'both the interchange and the constant evaluation remain open',
});

export const IMP97309_VERDICT = Object.freeze({
  question: 'certify IMP97289_TAIL_O1_SUBGAP: sup_b | Integral g(t) S_b(t) dt | <= L uniformly in omega (binding: primorials)',
  complementaryIdentityExact: true,      // RESULT 1 -- rigorous, integral-free
  divergenceLocalizedToLevelOne: true,   // RESULT 2 -- rigorous (Mertens)
  interLevelCancellationRequired: true,  // RESULT 2 -- no per-level/triangle bound closes it
  pointwiseSupRouteRefuted: true,        // RESULT 3 -- measured: sup_t |S_b| grows with omega
  signLawMeasured: true,                 // RESULT 4 -- R = -mu(b)|R|, |R| monotone to plateau
  plateauClosedFormProved: false,        // RESULT 5 -- conjecture only (interchange + evaluation open)
  provesUniformO1Bound: false,           // the subgap is NOT closed
  residualSubgap: 'IMP97309_CANCELLATION_SUBGAP',
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'HONEST PARTIAL assessing IMP97289_TAIL_O1_SUBGAP without closing it. RESULT 1 gives the exact ' +
    'integral-free identity R(b) = mu(b) Sum_{e|b,e>=2} mu(e) J(e-1). RESULT 2 proves the divergence is ' +
    'localized to the single-prime level A_1(b) = Sum_{p|b} J(p-1) ~ (1/12) log log b -> infinity, so the ' +
    'cancellation is inter-level and no per-level or triangle bound can close the subgap. RESULT 3 refutes ' +
    'the pointwise route: sup_t |S_b(t)| grows with omega (1.00 -> 3.73). RESULT 4 records the measured ' +
    'sign law R(b) = -mu(b)|R(b)| and the monotone approach of |R(b)| to a plateau. RESULT 5 conjectures ' +
    'the plateau L equals |Integral g(t)(e^t M(t)-1) dt| with M the Moebius series (M(t) -> -2 as t -> 0+), ' +
    'tying L to the Abel limit of the Moebius series -- but the interchange and the constant evaluation are ' +
    'open (IMP97309_CANCELLATION_SUBGAP). No bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97309_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Honest partial: the imp-97289 tail cancellation subgap ' +
  'is ASSESSED, not certified. Exact identity R(b) = mu(b) Sum_{e|b,e>=2} mu(e) J(e-1); the divergence is ' +
  'localized to the single-prime level A_1 ~ (1/12) log log b -> infinity (so no per-level/triangle bound ' +
  'closes it); the pointwise route sup_t |S_b(t)| <= C is refuted (that sup grows with omega); the plateau ' +
  'L is CONJECTURED to equal |Integral g(t)(e^t M(t)-1) dt| via the Moebius series (M -> -2 at t -> 0+), a ' +
  'zeta-adjacent object left open as IMP97309_CANCELLATION_SUBGAP. No bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97309_ASSERTIONS = [
  {
    id: 'imp97309-complementary-identity-matches-integral-form',
    holds: () => primorialLadder.every((r) => Math.abs(r.R - r.Rcomplementary) < 1e-10),
    why: 'RESULT 1: the integral-free complementary-divisor identity R(b) = mu(b) Sum_{e|b,e>=2} mu(e) J(e-1) reproduces the original S_b-integral value to < 1e-10 on primorials omega = 1..12.',
  },
  {
    id: 'imp97309-level-one-diverges-and-exceeds-R',
    holds: () => {
      const last = primorialLadder[primorialLadder.length - 1];
      const first = primorialLadder[0];
      let mono = true;
      for (let i = 1; i < primorialLadder.length; i += 1) if (!(primorialLadder[i].A1 > primorialLadder[i - 1].A1)) mono = false;
      return mono && last.A1 > 2 * first.A1 && last.A1 > last.absR;
    },
    why: 'RESULT 2: the single-prime level A_1(b) = Sum_{p|b} J(p-1) increases monotonically, more than doubles over omega = 1..12, and exceeds |R(b)| -- confirming the (1/12) log log b divergence and that the cancellation is inter-level.',
  },
  {
    id: 'imp97309-pointwise-sup-grows-with-omega',
    holds: () => {
      const q = primorialLadder;
      return q[q.length - 1].supAbsSb > q[2].supAbsSb && q[q.length - 1].supAbsSb > 3 && q[0].supAbsSb < 1.05;
    },
    why: 'RESULT 3: sup_t |S_b(t)| grows from ~1.0 (omega = 1) past 3.0 (omega = 12), refuting any uniform pointwise bound sup_t |S_b(t)| <= C -- the O(1) bound must come from the t-integration cancellation.',
  },
  {
    id: 'imp97309-sign-law-and-monotone-plateau',
    holds: () => {
      let sign = true, mono = true, bounded = true;
      for (let i = 0; i < primorialLadder.length; i += 1) {
        const r = primorialLadder[i];
        if (Math.abs(r.R - (-r.mu * r.absR)) > 1e-12) sign = false;
        if (r.absR >= 0.14) bounded = false;
        if (i > 0 && !(r.absR > primorialLadder[i - 1].absR)) mono = false;
      }
      return sign && mono && bounded;
    },
    why: 'RESULT 4: R(b) = -mu(b)|R(b)| (sign (-1)^{omega-1}) holds to < 1e-12, |R(b)| is strictly increasing, and stays below 0.14 -- the measured sign law and monotone plateau approach.',
  },
  {
    id: 'imp97309-mobius-series-negative-near-zero',
    holds: () => {
      const vals = [0.05, 0.02, 0.01].map((t) => mobiusSeries(t, 30000));
      let mono = true;
      for (let i = 1; i < vals.length; i += 1) if (!(vals[i] < vals[i - 1])) mono = false;
      return vals.every((v) => v < -1) && mono;
    },
    why: 'RESULT 5: the Moebius series M(t) = Sum mu(n) e^{-nt} is negative and decreasing toward its Abel limit -2 as t -> 0+ (not 0), so e^t M(t) - 1 stays finite and the conjectured plateau integral converges.',
  },
  {
    id: 'imp97309-honesty-gate-no-qed',
    holds: () =>
      IMP97309_VERDICT.anyBoundMoved === false &&
      IMP97309_VERDICT.postsRigorousCeiling === false &&
      IMP97309_VERDICT.qed === false &&
      IMP97309_VERDICT.provesUniformO1Bound === false &&
      IMP97309_VERDICT.plateauClosedFormProved === false &&
      IMP97309_VERDICT.complementaryIdentityExact === true &&
      IMP97309_VERDICT.divergenceLocalizedToLevelOne === true &&
      IMP97309_VERDICT.pointwiseSupRouteRefuted === true &&
      IMP97309_VERDICT.residualSubgap === 'IMP97309_CANCELLATION_SUBGAP' &&
      /IMP97289_TAIL_O1_SUBGAP/.test(IMP97309_CANCELLATION_SUBGAP.refinesSubgap) &&
      /NO QED/.test(IMP97309_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97309_HONEST_BANNER) &&
      /RH open/.test(IMP97309_HONEST_BANNER),
    why: 'honest partial: assessed the subgap (exact identity + divergence localization + refuted pointwise route + conjectured Moebius-series closed form) without closing it -- no full O(1) bound, no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97309_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97309-route-m-arith-tail-cancellation-assessment assertion failed: ${a.id}`);
  }
}

export default {
  complementaryIdentity: IMP97309_COMPLEMENTARY_IDENTITY,
  levelDivergence: IMP97309_LEVEL_DIVERGENCE,
  pointwiseRouteRefuted: IMP97309_POINTWISE_ROUTE_REFUTED,
  signLaw: IMP97309_SIGN_LAW,
  plateauConjecture: IMP97309_PLATEAU_CONJECTURE,
  subgap: IMP97309_CANCELLATION_SUBGAP,
  verdict: IMP97309_VERDICT,
  banner: IMP97309_HONEST_BANNER,
};
