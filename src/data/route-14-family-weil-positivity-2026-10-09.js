/**
 * @fileoverview route-14-family-weil-positivity-2026-10-09 — roadmap route 14 (batch 4): Weil positivity averaged over the nonprincipal
 * Dirichlet characters mod a prime q, versus positivity of each member.
 * One run plus one adversarial internal referee pass (not refuted, minor); the referee corrections are applied below.
 *
 * Outcome: Arb certifies the family-averaged form positive up to 2a = 10.0 (q = 257) and, in general, up to 2a ≈ 2 log q, while the
 * individual-character certificates on record reach only 2a ≈ 1.95–2.40 — a limit of the floor-certificate method, not of positivity
 * (under GRH every member is positive at every support). The gain is orthogonality plus the conductor term log q, and it is Euler-blind:
 * a family containing the RH-false Davenport–Heilbronn function is certified positive at 2a = 7.764. Referee framing (applied): the
 * RES-T crossover 2a = 7.764 is a ζ number (verified height ≈ 3e12) with no established meaning for these families; at q = 257,
 * 2a = ln 2355 positivity is already immediate from the triangle inequality.
 *
 * PROVED:
 *  - Exact identity (referee confirmed in mpmath to 15 digits for q = 7, 13, 29): the average over the q − 2 nonprincipal characters is the
 *    even real symbol σ_F(t) = log(q/π) + [(q−3) Re ψ(1/4 + it/2) + (q−1) Re ψ(3/4 + it/2)]/(2(q−2)) − Σ β_n cos(t log n),
 *    β_n = 2Λ(n) n^{−1/2} ((q−1)[n ≡ 1 mod q] − 1)/(q−2) for q ∤ n; even counts (q−3)/2, odd counts (q−1)/2; no pole terms; an even
 *    symbol means real h covers complex h.
 *  - All supports ⇔ GRH for every character mod q (Weil's criterion for the product L-function; classical, cited).
 *  - Limit of the certificate type: c ≤ m_T ≤ inf_{|t| ≥ T} σ(t) (compact Galerkin part), so a point σ(t0) < 0 with t0 ≥ T rules out
 *    every such certificate with cutoff T ≤ t0.
 *  - Dilution lemma: other m − 1 members ≥ (m − 1)μ and one member ≥ −B give the average ≥ ((m − 1)μ − B)/m.
 * CERTIFIED (python-flint/Arb, 256-bit; 2-sector Legendre–Galerkin, Gauss–Legendre with ellipse b = 0.35 < 1/2, LDL on the midpoint
 *  matrix, HS tail; certificate code audited line by line by the referee; the min(s, 0) patch is moot since every sector has s < 0):
 *  family W_F ≥ c‖h‖²: q = 5 at ln 3 0.2111690 and ln 16 1.0128e-4; q = 7 at ln 33 2.0533e-3; q = 13 at ln 55 0.3184924 and ln 90 0.2963611;
 *  q = 29 at ln 403 0.5988217; q = 53 at ln 2350 0.7950370 (floor-capped); q = 101 at ln 2355 1.5863178; q = 257 at ln 2355 2.3924835 and at
 *  ln 22027 = 10.0000 2.3362858. Individual Legendre mod 13: 0.27169 (ln 5), 0.040114 (ln 7). Kronecker witnesses σ_χ(t0) ∈ [−6.37, −4.19]
 *  at |t0| ∈ [1.04e4, 1.15e5] for all 11 members mod 13 (forces T > 1e4 at 2a = ln 55; referee matched 6 of 11 to 10 digits).
 *  Hybrid (254 non-Legendre characters mod 257 + F_DH) ≥ 0.8578‖h‖² at 2a = 7.7643 (μ ≥ 2.4015463, B_DH ≤ 391.2521; referee reproduced).
 *  Twin family (W_leg5 + 2W_DH)/3 certified NEGATIVE at 2a = 5.5 (W(g*)/‖g*‖² = −0.0576880; referee Ritz −0.057737 at N = 330).
 * CONDITIONAL: classical Weil explicit formula; Trefethen Thm 4.5; Arb correctness (digamma, Bessel, Legendre roots).
 * MEASURED: certificates vs independent Ritz upper bounds: ≤ 0.3% for q ≥ 13 (q = 257 at 2a = 10: 2.33629 vs 2.33645), 3.6% for q = 5 at
 *  ln 16, 2.2% for q = 7 at ln 33, q = 53 floor-capped (0.7950 vs 0.9894). Individual members fall below the double floor by 2a ≈ 3–4.
 *  Where the twin family first goes negative is NOT certified: positive Ritz values at 3.6–4.0 (+1.8e-10, +7e-12, +4e-13) are upper bounds
 *  on λ_min, and 4.25–5.25 is at the noise floor (referee: +1.3e-13 at 5.0, −9.3e-14 at 5.25). DH alone is certified negative from 2a = 3.44.
 * HEURISTIC: reach law ν = 2a/log q < 2 + O(log log T/log q) (parallel to Hughes–Rudnick and Bombieri–Vinogradov, not proved); family
 *  RES-T unproved, so "no zero information beyond Platt's verified GRH heights (≈ 1e8/q)" is heuristic.
 *
 * Closed class: family Weil positivity is GRH-equivalent at all supports and Euler-blind at finite support (tlb-dh-blind, NS-RIGID (d));
 * not a Λ lever. PT Λ ≤ 0.2 stands; RH and GRH open; NO QED. Import-free. ROUTE_14_ASSERTIONS rebuild the characters mod q and check the
 * orthogonality weights, recompute the triangle bound (q = 257 at ln 2355 positive; q = 101, 53 and q = 257 at 2a = 10 negative), the
 * dilution arithmetic, ν < 2 for every certificate and certificate ≤ Ritz live.
 */

const LOG = Math.log;
const EULER = 0.5772156649015329;
const PSI14 = -EULER - Math.PI / 2 - 3 * LOG(2);
const PSI34 = -EULER + Math.PI / 2 - 3 * LOG(2);
const vonMangoldt = (n) => { for (let p = 2; p * p <= n; p += 1) { if (n % p === 0) { let m = n; while (m % p === 0) m /= p; return m === 1 ? LOG(p) : 0; } } return n > 1 ? LOG(n) : 0; };
const primitiveRoot = (q) => { for (let g = 2; g < q; g += 1) { let x = 1, ord = 0; do { x = (x * g) % q; ord += 1; } while (x !== 1); if (ord === q - 1) return g; } return null; };
// triangle-inequality lower bound of the family symbol at 2a = log(K + 1): archimedean minimum at t = 0 minus Σ|β_n|, n ≤ K
const triangle = (q, K) => { let s = 0; for (let n = 2; n <= K; n += 1) { if (n % q === 0) continue; const L = vonMangoldt(n); if (!L) continue;
  s += (2 * L / Math.sqrt(n)) * Math.abs(((q - 1) * (n % q === 1 ? 1 : 0) - 1) / (q - 2)); }
  return LOG(q / Math.PI) + ((q - 3) * PSI14 + (q - 1) * PSI34) / (2 * (q - 2)) - s; };

export const ROUTE_14 = Object.freeze({
  id: 'route-14-family-weil-positivity-2026-10-09',
  route: 14,
  date: '2026-10-09',
  title: 'Route 14: family-averaged Weil positivity certifiable to 2a ≈ 2 log q (10.0 at q = 257); Euler-blind; not a lever',
  status: 'done',
  headline: 'Averaging the Weil form over the nonprincipal characters mod q lets Arb certify family positivity up to 2a = 10.0 (q = 257; ≈ 2 log q in general), '
    + 'while individual-character certificates reach 2a ≈ 1.95–2.40 (a limit of the floor method, not of positivity). The gain is orthogonality plus the conductor '
    + 'term and is Euler-blind: a family containing the RH-false F_DH is certified positive at 2a = 7.764. The ζ crossover 7.764 has no established meaning here.',

  certificates: Object.freeze([
    Object.freeze({ q: 5, e2a: 3, c: 0.2111690, ritz: 0.21316 }),
    Object.freeze({ q: 5, e2a: 16, c: 1.0128e-4, ritz: 1.0501e-4 }),
    Object.freeze({ q: 7, e2a: 33, c: 2.0533e-3, ritz: 2.0988e-3 }),
    Object.freeze({ q: 13, e2a: 55, c: 0.3184924, ritz: 0.319187 }),
    Object.freeze({ q: 13, e2a: 90, c: 0.2963611, ritz: 0.29686 }),
    Object.freeze({ q: 29, e2a: 403, c: 0.5988217, ritz: 0.60042 }),
    Object.freeze({ q: 53, e2a: 2350, c: 0.7950370, ritz: 0.98944, floorCapped: true }),
    Object.freeze({ q: 101, e2a: 2355, c: 1.5863178, ritz: 1.58723 }),
    Object.freeze({ q: 257, e2a: 2355, c: 2.3924835, ritz: 2.39281 }),
    Object.freeze({ q: 257, e2a: 22027, c: 2.3362858, ritz: 2.336454 }),
  ]),
  individual: Object.freeze({ legendre13: Object.freeze({ ln5: 0.27169, ln7: 0.040114, ritzLn5: 0.29383, ritzLn7: 0.04523 }), dag3QuarticPairLn11: true,
    kronecker13: Object.freeze({ members: 11, sigmaRange: Object.freeze([-6.37, -4.19]), tRange: Object.freeze([1.04e4, 1.15e5]) }) }),
  hybrid: Object.freeze({ q: 257, members: 255, muRest: 2.4015463, bDH: 391.2521, sDH: 390.630937818, baseDH: -0.6211528532, result: 0.8578, q101Members: 98, q101Mu: 1.60177, q101B: 390.5 }),
  twin: Object.freeze({ certifiedNegativeAt: 5.5, witness: -0.0576880, refereeRitz: -0.057737, dhNegativeFrom: 3.44, ritzPositiveUpper: Object.freeze({ 3.6: 1.83e-10, 3.8: 7.05e-12, 4.0: 3.8e-13 }) }),

  refereeKilled: Object.freeze([
    '"past the RES-T crossover 2a = 7.764 for q ≥ 53" — 7.764 is a ζ number (verified height ≈ 3e12); no family RES-T exists; at q = 257, 2a = ln 2355 positivity follows from the triangle inequality (0.6436 > 0)',
    '"the twin family detects its off-line zero only around 2a = 5.5" — only negativity at 5.5 is certified; below 5.5 nothing is certified positive (Ritz upper bounds, noise floor on 4.25–5.25); DH alone is certified negative from 3.44, not "about 3.7"',
    '"each certificate within ≈ 0.5% of Ritz" — false for q = 5 (3.6%) and q = 7 (2.2%); true (≤ 0.3%) for q ≥ 13',
    '"individual reach stays near 2a = 2–2.8" — individual certificates on record reach 1.95 (Legendre mod 13) and 2.40 (dag3 quartic pair); 2.77 was the q = 5 family; the limit is the method, not positivity',
    '"the extra support carries no zero information" (headline) — the hybrid shows a positive average does not imply positive members (existing Euler-blindness class); "no zero information beyond verified GRH data" rests on an unproved family RES-T (heuristic)',
  ]),
  nextStep: 'Close route 14 as a mapped, Euler-blind class (not a lever). Optional: (1) state and prove a family RES-T (union zero density m·log(qH/2π)) and compare '
    + 'with Platt\'s verified GRH heights to settle whether any certifiable family support passes the family information ceiling (expected: no for ν < 2); '
    + '(2) exact-Ritz scan of the twin family on 4.0 < 2a < 5.25.',
  files: Object.freeze(['tmp/routes-b4-14-lib.py', 'tmp/routes-b4-14-arb-cert.py', 'tmp/routes-b4-14-witness.py', 'tmp/routes-b4-14-twin-witness.py', 'tmp/routes-b4-14-dhbound.py',
    'tmp/routes-b4-14/summary.json', 'tmp/routes-b4-14/dhbound-K2354.json', 'tmp/routes-b4-ref-14-ritz.py', 'tmp/routes-b4-ref-14-twin.py', 'tmp/routes-b4-ref-14/ritz.jsonl']),
  verdict: 'Family-averaged Weil positivity is certifiable far beyond individual positivity (2a = 10.0 at q = 257; ≈ 2 log q), because only n ≡ 1 mod q enters at full '
    + 'weight and the conductor term log q is large; individual certificates stop at 2a ≈ 2 for method reasons. The gain is Euler-blind (hybrid with F_DH certified '
    + 'positive at 7.764) and, at all supports, family positivity is exactly GRH for every character mod q. At finite support it implies nothing about individual zeros; '
    + 'that it adds nothing beyond verified GRH data is heuristic. Not a Λ lever. PT Lambda <= 0.2 stands; RH and GRH open; NO QED.',
});

const R = ROUTE_14;

export const ROUTE_14_ASSERTIONS = Object.freeze([
  {
    id: 'r14-orthogonality',
    holds: () => [5, 7, 13, 29].every((q) => { const g = primitiveRoot(q); const ind = new Map(); let x = 1; for (let k = 0; k < q - 1; k += 1) { ind.set(x, k); x = (x * g) % q; }
      let even = 0, odd = 0; for (let j = 1; j < q - 1; j += 1) { if (j % 2 === 0) even += 1; else odd += 1; }
      const ok = Array.from({ length: q - 1 }, (_, i) => i + 1).every((n) => { const k = ind.get(n); let s = 0;
        for (let j = 1; j < q - 1; j += 1) s += Math.cos((2 * Math.PI * j * k) / (q - 1)); return Math.abs(s - ((q - 1) * (n === 1 ? 1 : 0) - 1)) < 1e-9; });
      return ok && even === (q - 3) / 2 && odd === (q - 1) / 2; }),
    why: 'Σ over the q − 2 nonprincipal χ mod q of χ(n) = (q − 1)[n ≡ 1] − 1, with (q − 3)/2 even and (q − 1)/2 odd characters (q = 5, 7, 13, 29).',
  },
  {
    id: 'r14-triangle-bound',
    holds: () => { const t257 = triangle(257, 2354); return Math.abs(t257 - 0.6436) < 1e-3 && triangle(101, 2354) < 0 && triangle(53, 2349) < 0 && triangle(257, 22026) < 0; },
    why: 'log(q/π) + w0ψ(1/4) + w1ψ(3/4) − Σ|β_n| = 1.7538 − 1.1102 = 0.6436 > 0 for q = 257 at 2a = ln 2355 (trivial positivity); negative for q = 101, 53 at 7.76 and q = 257 at 2a = 10 (Galerkin needed).',
  },
  {
    id: 'r14-dilution',
    holds: () => { const H = R.hybrid; const v = ((H.members - 1) * H.muRest - H.bDH) / H.members;
      return Math.abs(v - H.result) < 1e-3 && Math.abs(H.sDH - H.baseDH - H.bDH) < 2e-5 && H.q101Members * H.q101Mu < H.q101B; },
    why: '(254·2.4015463 − 391.2521)/255 = 0.8578 > 0; B_DH = S_DH − base = 390.6309 + 0.6212; for q = 101, 98·1.60177 = 157.0 < 390.5 (no conclusion).',
  },
  {
    id: 'r14-reach-law',
    holds: () => R.certificates.every((x) => LOG(x.e2a) / LOG(x.q) < 2) && Math.abs(LOG(22027) - 10) < 1e-4,
    why: 'Every family certificate has ν = 2a/log q < 2 (max 1.955 at q = 53, 2a = ln 2350); ln 22027 = 10.0000.',
  },
  {
    id: 'r14-certificate-below-ritz',
    holds: () => R.certificates.every((x) => x.c <= x.ritz) && R.certificates.filter((x) => x.q >= 13 && !x.floorCapped).every((x) => (x.ritz - x.c) / x.ritz <= 3e-3)
      && R.certificates.filter((x) => x.q <= 7 && x.e2a > 3).every((x) => (x.ritz - x.c) / x.ritz > 0.02)
      && R.individual.legendre13.ln5 <= R.individual.legendre13.ritzLn5 && R.individual.legendre13.ln7 <= R.individual.legendre13.ritzLn7,
    why: 'Each certified lower bound lies below the referee\'s independent Ritz upper bound: ≤ 0.3% gap for q ≥ 13 (not floor-capped), 2.2–3.6% for q = 5, 7.',
  },
  {
    id: 'r14-twin-scope',
    holds: () => R.twin.witness < 0 && Math.abs(R.twin.witness - R.twin.refereeRitz) < 1e-3 && R.twin.dhNegativeFrom < R.twin.certifiedNegativeAt
      && Object.values(R.twin.ritzPositiveUpper).every((x) => x > 0 && x < 1e-9),
    why: 'Twin family certified negative at 2a = 5.5 (−0.0576880; referee −0.057737); its positive Ritz values at 3.6–4.0 are ≤ 1.8e-10 upper bounds, so the onset is not certified; DH alone negative from 3.44.',
  },
  {
    id: 'r14-honest-scope',
    holds: () => R.status === 'done' && /Euler-blind/.test(R.verdict) && /heuristic/.test(R.verdict) && /Not a Λ lever/.test(R.verdict)
      && /PT Lambda <= 0\.2 stands/.test(R.verdict) && /NO QED/.test(R.verdict) && /ζ number/.test(R.refereeKilled[0]),
    why: 'Euler-blind, GRH-equivalent class; "no zero information" graded heuristic; no Λ change; no QED.',
  },
]);

export default ROUTE_14;
