/**
 * @module imp-97167-route-m-parity-sign-law-derivation
 *
 * imp-97167 (proof, DERIVATION -- explains an empirical sign law): DERIVE the imp-97140 Route M
 * residual parity sign law from the imp-97133 Theorem-1 Moebius/Stirling remainder divisor sum.
 * imp-97140 RESULT 1 MEASURED that sign(r(b)) tracks the parity of omega(b) (the count of distinct
 * primes) -- 2799 of 2801 for b in [200,3000] -- and ATTRIBUTED it to the leading Moebius/Stirling
 * remainder term of R0(b) carrying an overall parity factor, but did NOT derive it. This module
 * derives the leading term of r(b) explicitly, proves it carries the parity of omega(b), and
 * characterizes EXACTLY when a subleading opposite-sign term dominates (the primorial-collapse
 * exceptions of imp-97140 RESULT 2). Derivation only; explains an empirical sign law; no bound moves;
 * no refereed bound is changed; RH open; NO QED.
 *
 * Notation as imp-97096 / imp-97133 / imp-97140: C = (log 2pi - gamma)/2 = 0.6303307...,
 * R_b = {a : 1 <= a <= b-1, (a,b)=1}, A(a,b) = C(a+b) + (1/2)(a-b) log(b/a),
 * F_arith(b) = Sum_{a in R_b} A(a,b), kappa_arith = (3/2) C - 3/8 = 0.5704960511308594...,
 * r(b) = F_arith(b)/(phi(b) b) - kappa_arith, omega(b) = number of distinct primes dividing b.
 *
 * -------------------------------------------------------------------------------
 * STEP 0 -- r(b) as an equidistribution discrepancy of a single scale-free kernel.
 * -------------------------------------------------------------------------------
 * A(a,b) is homogeneous of degree 1: with x = a/b in (0,1),
 *     A(a,b) = b * psi(x),      psi(x) = C(1+x) + (1/2)(1-x) log x.
 * Integrating the kernel over the unit interval REPRODUCES the leading constant exactly:
 *     Int_0^1 psi(x) dx = (3/2) C + (1/2)[ Int_0^1 log x dx - Int_0^1 x log x dx ]
 *                       = (3/2) C + (1/2)[ (-1) - (-1/4) ] = (3/2) C - 3/8 = kappa_arith.
 * Hence r(b) is EXACTLY the discrepancy of psi averaged over the coprime residues a/b vs its integral:
 *     r(b) = (1/phi(b)) Sum_{a in R_b} psi(a/b) - Int_0^1 psi(x) dx.
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- Moebius inversion turns the coprime average into a clean divisor sum in m = b/d.
 * -------------------------------------------------------------------------------
 * By Moebius inversion of the coprimality constraint (as in imp-97133),
 *     Sum_{a in R_b} psi(a/b) = Sum_{d|b} mu(d) Sum_{k=1}^{b/d} psi(k d / b) = Sum_{m|b} mu(b/m) S(m),
 * where m = b/d runs over the divisors of b and S(m) = Sum_{j=1}^{m} psi(j/m) is a right-endpoint
 * Riemann sum. Using the EXACT Euler telescope Sum_{d|b} mu(d)(b/d) = phi(b), i.e.
 * Sum_{m|b} mu(b/m) m = phi(b), and kappa_arith = Int_0^1 psi, one gets the clean identity
 *     r(b) phi(b) = Sum_{m|b} mu(b/m) D(m),      D(m) := S(m) - m * kappa_arith,
 * where D(m) is the Euler-Maclaurin discrepancy of psi at resolution m. (Verified below to machine
 * precision on a mixed ladder of b.)
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- the discrepancy D(m) via Stirling / Glaisher (this is the imp-97133 remainder, cleanly).
 * -------------------------------------------------------------------------------
 * Expanding S(m) with log(m!) (Robbins-Stirling) and the hyperfactorial G(m) = Sum k log k
 * (Glaisher-Kinkelin, constant log A), the O(m) parts cancel against m * kappa_arith and
 *     D(m) = (1/4) log m + K + delta(m),   K = (1/2) log(2pi) - gamma/4 = 0.7746346...,
 *     delta(m) = -(log m)/(24 m) + (1/24 - (log A)/2)/m + O(1/m^2)  ->  0,   delta(m) < 0.
 * The single log(m!) Stirling half-log is the source of the (1/4) log m growth; delta(m) is the
 * genuinely decaying tail. Numerically delta(1) = -0.084469, delta(2) = -0.056043,
 * delta(3) = -0.042904, ... : delta is NEGATIVE and STRICTLY INCREASING toward 0.
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- the two Moebius sums: von Mangoldt on the log, annihilation on the constant.
 * -------------------------------------------------------------------------------
 * Substituting the STEP-2 decomposition into the STEP-1 identity splits r(b) phi(b) into three
 * divisor sums, two of which evaluate in closed form:
 *   (a) Sum_{m|b} mu(b/m) * (1/4) log m = (1/4) Lambda(b)      [the classical mu * log = Lambda identity];
 *   (b) Sum_{m|b} mu(b/m) * K           = K * [b = 1] = 0       [b >= 2];
 *   (c) Sum_{m|b} mu(b/m) * delta(m)    =: Delta_omega(b)       [the decaying-tail difference].
 * Therefore
 *     r(b) phi(b) = (1/4) Lambda(b) + Delta_omega(b).
 * Lambda(b) = log p on prime powers b = p^k (omega = 1) and 0 otherwise. So for PRIME POWERS the
 * leading term is (1/4) log p > 0 -- this is why r > 0 on prime powers where mu vanishes, i.e. the
 * law is LIOUVILLE-type (parity of omega), not literally mu(b) (imp-97140 RESULT 1). For omega(b) >= 2
 * the Lambda term is ZERO and the sign is set entirely by the tail difference Delta_omega(b).
 *
 * -------------------------------------------------------------------------------
 * STEP 4 -- the tail difference carries the parity of omega (non-primorial case).
 * -------------------------------------------------------------------------------
 * For SQUAREFREE b = p_1 ... p_k (k = omega(b)), writing each divisor m as the product over a subset
 * S of the primes, mu(b/m) = (-1)^(k - |S|), so Delta_omega(b) is a k-th mixed finite difference:
 *     Delta_omega(b) = Sum_{S subset of {p_1..p_k}} (-1)^(k - |S|) delta( prod_{p in S} p ).
 * Its LEADING term is the empty subset S = {} : (-1)^k delta(1), with |delta(1)| = 0.084469 the LARGEST
 * of all |delta(m_S)| (delta is monotone increasing toward 0). When the primes are not all small the
 * other subset terms are strictly smaller in magnitude, so delta(1) dominates and
 *     sign( r(b) ) = sign( (-1)^k delta(1) ) = (-1)^(k+1)   ( delta(1) < 0 ),
 * i.e. r > 0 for omega ODD and r < 0 for omega EVEN. (For non-squarefree b the sum runs over the
 * co-squarefree divisors m = b / (squarefree | rad(b)); the same delta(1) leading term and parity
 * survive, matching the empirical law on all of [200,3000].)
 *
 * NOTE ON THE SIGN CONVENTION. The empirical law is r > 0 for omega ODD and r < 0 for omega EVEN
 * (imp-97140 cohorts: omega=1 -> r>0, omega=2 -> r<0, omega=3 -> r>0, omega=4 -> r<0, and its own
 * inline comment "omega odd -> r>0"). That is sign(r(b)) = (-1)^(omega(b)+1), equivalently
 * -(-1)^omega(b). The imp-97140 rule STRING "(-1)^omega(b)" is mislabeled relative to its own
 * comment/data (it would give the opposite sign); the derived and data-consistent statement is
 * (-1)^(omega+1). This module records the corrected form.
 *
 * -------------------------------------------------------------------------------
 * STEP 5 -- the exceptions are exactly the primorial collapse (imp-97140 RESULT 2).
 * -------------------------------------------------------------------------------
 * When ALL of p_1..p_k are small (a primorial-type modulus) every subset product m_S is small, so
 * every delta(m_S) is comparable in size and the k-th mixed difference Delta_omega(b) ANNIHILATES the
 * leading (-1)^k delta(1) down toward the floor: measured |Delta| collapses from 0.084 to
 * ~5e-4 (b=2310) and ~2e-3 (b=30030), and the surviving subleading residual has the OPPOSITE sign,
 * flipping r. This is exactly why the only sign-law violations in [200,3000] are the smoothest
 * primorial moduli b = 2310 = 2.3.5.7.11 and b = 2730 = 2.3.5.7.13 (both omega=5, law predicts
 * r > 0, both give r < 0 at the ~1e-6 floor), and b = 30030 = 2.3.5.7.11.13 upward (omega=6, law
 * predicts r < 0, gives r > 0). The sign law is robust exactly where delta(1) is not annihilated.
 *
 * -------------------------------------------------------------------------------
 * RESIDUAL (named sub-gap): quantitative non-cancellation for ALL non-primorial b.
 * -------------------------------------------------------------------------------
 * STEP 4 shows delta(1) DOMINATES when the other subset terms are individually smaller; it does not
 * PROVE the k-th mixed difference Delta_omega(b) keeps the sign of (-1)^k delta(1) for EVERY
 * non-primorial b. A fully rigorous sign statement needs a quantitative lower bound
 * |Delta_omega(b)| >= |delta(1)| - (sum of subordinate subset terms) > 0 with the correct sign,
 * i.e. a complete-monotonicity / convexity control of delta on the multiplicative lattice of small
 * subset products, with an explicit primorial-collapse threshold separating the robust region from
 * the exceptions. That quantitative non-cancellation bound is the residual of this leaf. Derivation
 * only: the leading term and its parity are derived and the collapse mechanism identified; no
 * uniform sign certificate is supplied, no bound moved, T ~ 2.594e7 anchor unchanged, no refereed bound is changed
 * , RH open, NO QED.
 *
 * @see imp-97140-route-m-fixed-omega-residual-cohorts.js (the MEASURED sign + magnitude laws)
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the Moebius/Stirling remainder)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (exact kappa_arith)
 * @see imp-97071-route-m-lower-companion-first-moment-reduction.js (parent CS first-moment reduction)
 *
 * Ticket: imp-97167 (proof, opus-4-8, api-pool). Derivation of an empirical sign law; NO QED.
 */

const GAMMA = 0.5772156649015329;
const C = (Math.log(2 * Math.PI) - GAMMA) / 2; // (log 2pi - gamma)/2 = 0.6303307...
const LOG_A = 0.2487544770337842; // log of the Glaisher-Kinkelin constant A

// EXACT leading coefficient of F_arith(b)/(phi(b) b) (imp-97096/imp-97133), self-contained.
export const IMP97167_KAPPA_ARITH = 1.5 * C - 3 / 8; // = 0.5704960511308594

// The Stirling/Glaisher discrepancy constant K = (1/2) log 2pi - gamma/4.
export const IMP97167_K = 0.5 * Math.log(2 * Math.PI) - GAMMA / 4;

// -- exact O(b) kernels (self-checked at import) --
const gcd = (x, y) => (y === 0 ? x : gcd(y, x % y));
const psi = (x) => C * (1 + x) + 0.5 * (1 - x) * Math.log(x); // A(a,b) = b psi(a/b)
const Aab = (a, b) => C * (a + b) + 0.5 * (a - b) * Math.log(b / a);

function omega(b) {
  let n = b, c = 0;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) { c += 1; while (n % p === 0) n /= p; }
  }
  if (n > 1) c += 1;
  return c;
}
function muOf(n) {
  if (n === 1) return 1;
  let m = n, cnt = 0;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) { m /= p; if (m % p === 0) return 0; cnt += 1; }
  }
  if (m > 1) cnt += 1;
  return cnt % 2 === 0 ? 1 : -1;
}
function divisors(b) { const d = []; for (let i = 1; i <= b; i++) if (b % i === 0) d.push(i); return d; }
function vonMangoldt(n) {
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) { while (m % p === 0) m /= p; return m === 1 ? Math.log(p) : 0; }
  }
  return n > 1 ? Math.log(n) : 0;
}
function primeList(n) { const f = []; let m = n; for (let p = 2; p * p <= m; p++) { if (m % p === 0) { f.push(p); while (m % p === 0) m /= p; } } if (m > 1) f.push(m); return f; }

// D(m) = Sum_{j=1}^m psi(j/m) - m kappa_arith  (the discrepancy of psi at resolution m).
function Dm(m) { let s = 0; for (let j = 1; j <= m; j++) s += psi(j / m); return s - m * IMP97167_KAPPA_ARITH; }
// delta(m) = D(m) - (1/4) log m - K  (the decaying tail; delta < 0, increasing to 0).
function deltaM(m) { return Dm(m) - 0.25 * Math.log(m) - IMP97167_K; }

// Direct r(b) and phi(b) by an independent O(b) recompute.
function rOf(b) { let phi = 0, F = 0; for (let a = 1; a < b; a++) { if (gcd(a, b) === 1) { phi += 1; F += Aab(a, b); } } return { r: F / (phi * b) - IMP97167_KAPPA_ARITH, phi }; }

export const IMP97167_IDENTITIES = Object.freeze({
  kernel: 'A(a,b) = b psi(a/b), psi(x) = C(1+x) + (1/2)(1-x) log x',
  kappaAsIntegral: 'kappa_arith = Int_0^1 psi(x) dx = (3/2) C - 3/8',
  discrepancy: 'r(b) phi(b) = Sum_{m|b} mu(b/m) D(m), D(m) = Sum_{j=1}^m psi(j/m) - m kappa_arith',
  eulerTelescope: 'Sum_{m|b} mu(b/m) m = phi(b) (exact Euler phi-formula)',
  discrepancyExpansion: 'D(m) = (1/4) log m + K + delta(m), K = (1/2) log 2pi - gamma/4, delta(m) < 0 -> 0',
  deltaTail: 'delta(m) = -(log m)/(24 m) + (1/24 - (log A)/2)/m + O(1/m^2)',
  vonMangoldtSum: 'Sum_{m|b} mu(b/m)(1/4) log m = (1/4) Lambda(b)  [mu * log = Lambda]',
  constantAnnihilation: 'Sum_{m|b} mu(b/m) K = K [b=1] = 0 for b >= 2',
  masterFormula: 'r(b) phi(b) = (1/4) Lambda(b) + Delta_omega(b), Delta_omega(b) = Sum_{m|b} mu(b/m) delta(m)',
  squarefreeDifference: 'squarefree b: Delta_omega(b) = Sum_{S subset primes} (-1)^(k-|S|) delta(prod S), leading (-1)^k delta(1)',
});

export const IMP97167_SIGN_LAW = Object.freeze({
  derivedRule: 'sign(r(b)) = (-1)^(omega(b)+1)  [ r>0 for omega ODD, r<0 for omega EVEN ]',
  equivalently: '-(-1)^omega(b)',
  leadingTerm: '(-1)^omega(b) delta(1), delta(1) = -0.084469 < 0, so sign = (-1)^(omega+1)',
  primePowerCase: 'omega=1 (prime powers): r phi = (1/4) log p > 0 via Lambda(b); Liouville-type, holds where mu=0',
  imp97140RuleStringMislabeled: true, // imp-97140 wrote "(-1)^omega"; its comment/data say omega odd -> r>0 = (-1)^(omega+1)
  isLiouvilleNotMoebius: true,
  exceptions: 'the smoothest primorial moduli (b=2310, 2730; and b=30030 upward), where the k-fold difference collapses delta(1) to the floor and a subleading opposite-sign term flips r',
});

export const IMP97167_VERDICT = Object.freeze({
  question:
    'derive the imp-97140 residual parity sign law sign(r(b)) tracks parity of omega(b) from the ' +
    'imp-97133 Moebius/Stirling remainder divisor sum, and characterize the primorial-collapse exceptions',
  masterFormula: 'r(b) phi(b) = (1/4) Lambda(b) + Sum_{m|b} mu(b/m) delta(m)',
  signLawDerived: 'sign(r(b)) = (-1)^(omega(b)+1) (r>0 for omega odd)', // corrected orientation
  leadingTermCarriesParity: true, // (-1)^omega delta(1), delta(1)<0
  primePowersViaVonMangoldt: true, // Lambda term makes it Liouville-type, not literally mu
  exceptionsArePrimorialCollapse: true, // k-fold mixed difference annihilates delta(1) for all-small primes
  correctsImp97140SignString: true, // (-1)^omega -> (-1)^(omega+1) to match its own data
  suppliesUniformSignCertificate: false, // quantitative non-cancellation for all non-primorial b is the residual
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  qed: false,
  conclusion:
    'The imp-97140 residual parity sign law is DERIVED from the imp-97133 remainder: writing A(a,b) = ' +
    'b psi(a/b) makes r(b) the equidistribution discrepancy of psi over coprime residues, and Moebius ' +
    'inversion plus the Euler telescope give the exact identity r(b) phi(b) = Sum_{m|b} mu(b/m) D(m) with ' +
    'D(m) the Stirling/Glaisher discrepancy. Decomposing D(m) = (1/4) log m + K + delta(m) and using the ' +
    'mu*log = Lambda identity and Sum mu(b/m) = 0 collapses this to r(b) phi(b) = (1/4) Lambda(b) + ' +
    'Sum_{m|b} mu(b/m) delta(m). On prime powers the Lambda term gives r>0 (Liouville-type, holds where ' +
    'mu=0); for omega >= 2 the leading tail term is (-1)^omega delta(1) with delta(1) = -0.084469 < 0, so ' +
    'sign(r(b)) = (-1)^(omega+1) (r>0 for omega odd) -- matching the imp-97140 data and correcting its ' +
    'mislabeled rule string. The two sign-law exceptions are exactly the primorial moduli where the k-fold ' +
    'Moebius difference annihilates delta(1) to the floor and a subleading opposite-sign term flips r. A ' +
    'uniform quantitative non-cancellation bound for ALL non-primorial b is left as the named residual. ' +
    'No bound moved; T ~ 2.594e7 anchor; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97167_SUBGAP = Object.freeze({
  id: 'imp-97167-parity-sign-law-uniform-noncancellation',
  statement:
    'The derivation shows the leading tail term (-1)^omega delta(1) dominates when the subordinate subset ' +
    'products are individually smaller, but does not PROVE the k-th mixed Moebius difference Delta_omega(b) ' +
    '= Sum_{m|b} mu(b/m) delta(m) retains the sign of (-1)^omega delta(1) for EVERY non-primorial b. A ' +
    'rigorous sign certificate needs a quantitative lower bound |Delta_omega(b)| >= |delta(1)| - (subordinate ' +
    'subset terms) > 0 with the correct sign -- a complete-monotonicity / convexity control of delta on the ' +
    'multiplicative lattice of small subset products, with an explicit primorial-collapse threshold ' +
    'separating the robust region from the b=2310/2730/30030 exceptions. That uniform non-cancellation bound ' +
    'is the residual of this leaf.',
  parent: 'imp-97140-route-m-fixed-omega-residual-cohorts',
});

export const IMP97167_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Derivation of an empirical sign law: r(b) phi(b) = ' +
  '(1/4) Lambda(b) + Sum_{m|b} mu(b/m) delta(m) (from A(a,b) = b psi(a/b), Moebius inversion, the Euler ' +
  'telescope and mu*log = Lambda). The leading tail term (-1)^omega delta(1) with delta(1) < 0 gives ' +
  'sign(r(b)) = (-1)^(omega+1) (r>0 for omega odd) -- matching and correcting the imp-97140 data; the two ' +
  'exceptions are the primorial moduli where the k-fold difference collapses delta(1). A uniform ' +
  'non-cancellation certificate for all non-primorial b stays a residual; no bound on Lambda moved.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97167_ASSERTIONS = [
  {
    id: 'imp97167-kappa-and-constants',
    holds: () =>
      Math.abs(IMP97167_KAPPA_ARITH - (1.5 * C - 0.375)) < 1e-15 &&
      Math.abs(IMP97167_KAPPA_ARITH - 0.5704960511308594) < 1e-12 &&
      Math.abs(IMP97167_K - (0.5 * Math.log(2 * Math.PI) - GAMMA / 4)) < 1e-15 &&
      Math.abs(IMP97167_K - 0.7746346169792895) < 1e-12,
    why: 'kappa_arith = (3/2) C - 3/8 = 0.5704960511308594 and the discrepancy constant K = (1/2) log 2pi - gamma/4 = 0.7746346 recomputed self-containedly.',
  },
  {
    id: 'imp97167-kernel-homogeneity-and-integral',
    holds: () => {
      // A(a,b) = b psi(a/b) exactly, and Int_0^1 psi = kappa_arith (closed form 3/2 C - 3/8).
      for (const [a, b] of [[3, 10], [7, 12], [1, 5], [11, 30]]) {
        if (Math.abs(Aab(a, b) - b * psi(a / b)) > 1e-9 * (Math.abs(Aab(a, b)) + 1)) return false;
      }
      // numeric integral of psi vs kappa (Simpson on (eps,1), integrable log singularity)
      let I = 0; const Nn = 200000, e = 1e-9;
      for (let i = 0; i <= Nn; i++) {
        const x = e + (1 - e) * (i / Nn);
        const w = i === 0 || i === Nn ? 1 : (i % 2 === 1 ? 4 : 2);
        I += w * psi(x);
      }
      I *= (1 - e) / (3 * Nn);
      return Math.abs(I - IMP97167_KAPPA_ARITH) < 1e-5;
    },
    why: 'A(a,b) = b psi(a/b) with psi(x) = C(1+x) + (1/2)(1-x) log x, and Int_0^1 psi(x) dx = kappa_arith (so r(b) is a genuine equidistribution discrepancy).',
  },
  {
    id: 'imp97167-master-identity-r-phi-equals-mu-D-sum',
    holds: () => {
      // r(b) phi(b) = Sum_{m|b} mu(b/m) D(m) to machine precision (the STEP-1 identity).
      for (const b of [1009, 1024, 2187, 1003, 1001, 1155, 1995, 210, 2310, 2730]) {
        const { r, phi } = rOf(b);
        let S = 0; for (const m of divisors(b)) S += muOf(b / m) * Dm(m);
        if (Math.abs(r * phi - S) > 1e-7 * (Math.abs(r * phi) + 1)) return false;
      }
      return true;
    },
    why: 'the master identity r(b) phi(b) = Sum_{m|b} mu(b/m) D(m) (Moebius inversion + Euler telescope) reproduces the direct O(b) recompute to machine precision on a mixed ladder.',
  },
  {
    id: 'imp97167-vonMangoldt-reduction-and-constant-annihilation',
    holds: () => {
      // Sum mu(b/m)(1/4 log m) = (1/4) Lambda(b), and Sum mu(b/m) = 0 for b>=2.
      for (const b of [1009, 1024, 2187, 1003, 1001, 1155, 2310, 2730]) {
        let sLog = 0, sOne = 0;
        for (const m of divisors(b)) { sLog += muOf(b / m) * 0.25 * Math.log(m); sOne += muOf(b / m); }
        if (Math.abs(sLog - 0.25 * vonMangoldt(b)) > 1e-9) return false;
        if (Math.abs(sOne) > 1e-9) return false;
      }
      return true;
    },
    why: 'Sum_{m|b} mu(b/m)(1/4) log m = (1/4) Lambda(b) (mu*log = Lambda, nonzero only on prime powers) and Sum_{m|b} mu(b/m) = 0 for b>=2, so the master formula r phi = (1/4) Lambda + Sum mu(b/m) delta(m) holds.',
  },
  {
    id: 'imp97167-delta-negative-and-monotone',
    holds: () => {
      // delta(m) < 0 for all small m and strictly increasing toward 0 (so delta(1) is the dominant term).
      let prev = -Infinity;
      for (const m of [1, 2, 3, 5, 7, 11, 17, 59, 100, 1000]) {
        const d = deltaM(m);
        if (!(d < 0)) return false;
        if (!(d > prev)) return false;
        prev = d;
      }
      return Math.abs(deltaM(1) - (-0.084469)) < 1e-4; // delta(1) = -0.084469
    },
    why: 'delta(m) is negative and strictly increasing toward 0 on the small-m ladder (delta(1) = -0.084469 the largest in magnitude), so the leading tail term (-1)^omega delta(1) dominates for non-primorial b.',
  },
  {
    id: 'imp97167-sign-law-orientation-and-holds',
    holds: () => {
      // Derived orientation: r>0 for omega ODD, r<0 for omega EVEN, i.e. sign = (-1)^(omega+1).
      let viol = 0;
      for (let b = 200; b <= 800; b++) {
        const { r } = rOf(b);
        const exp = omega(b) % 2 === 1 ? 1 : -1; // (-1)^(omega+1)
        if (Math.sign(r) !== exp) viol += 1;
      }
      // cohort spot-check (imp-97140): omega 1,3 -> +, omega 2,4 -> -
      const plus = [1009, 1024, 2187, 1001, 1105].every((b) => rOf(b).r > 0);
      const minus = [1003, 2021, 1155, 1995].every((b) => rOf(b).r < 0);
      return viol === 0 && plus && minus && IMP97167_SIGN_LAW.imp97140RuleStringMislabeled === true;
    },
    why: 'the derived law sign(r(b)) = (-1)^(omega+1) (r>0 for omega odd) holds with zero violations across b in [200,800] and on the imp-97140 cohorts -- the primorial exceptions 2310/2730 lie above this window; the imp-97140 rule string "(-1)^omega" is the mislabeled orientation.',
  },
  {
    id: 'imp97167-leading-term-dominates-nonprimorial',
    holds: () => {
      // for non-primorial squarefree b, sign(r phi) = sign((-1)^omega delta(1)).
      const d1 = deltaM(1);
      for (const b of [1003, 1001, 1105, 1155, 1995, 2015]) {
        const { r, phi } = rOf(b);
        const lead = Math.pow(-1, omega(b)) * d1;
        if (Math.sign(r * phi) !== Math.sign(lead)) return false;
      }
      return true;
    },
    why: 'for non-primorial b the sign of r(b) phi(b) equals the sign of the leading tail term (-1)^omega delta(1), confirming delta(1) dominates the k-fold Moebius difference.',
  },
  {
    id: 'imp97167-primorial-collapse-exceptions',
    holds: () => {
      // subset-difference form reproduces r phi; primorial b=2310 collapses delta(1) and flips sign.
      const d1 = Math.abs(deltaM(1));
      for (const b of [1001, 2310, 30030]) {
        const P = primeList(b), k = P.length;
        let s = 0;
        for (let mask = 0; mask < (1 << k); mask++) {
          let prod = 1, cnt = 0;
          for (let i = 0; i < k; i++) if (mask & (1 << i)) { prod *= P[i]; cnt += 1; }
          s += Math.pow(-1, k - cnt) * deltaM(prod);
        }
        const { r, phi } = rOf(b);
        if (Math.abs(s - r * phi) > 1e-6 * (Math.abs(r * phi) + 1)) return false; // subset form = r phi
      }
      // b=2310 (omega=5): law predicts r>0 but collapse flips to r<0, at the ~1e-6 floor.
      const { r: r2310 } = rOf(2310);
      if (!(r2310 < 0 && Math.abs(r2310) < 5e-6)) return false;
      // collapse: |Delta| at 2310 is far below |delta(1)|.
      const P = primeList(2310), k = P.length; let s = 0;
      for (let mask = 0; mask < (1 << k); mask++) { let prod = 1, cnt = 0; for (let i = 0; i < k; i++) if (mask & (1 << i)) { prod *= P[i]; cnt += 1; } s += Math.pow(-1, k - cnt) * deltaM(prod); }
      return Math.abs(s) < 0.1 * d1; // collapsed well below the leading |delta(1)|
    },
    why: 'the subset-difference form Sum_S (-1)^(k-|S|) delta(prod S) reproduces r(b) phi(b); for the primorial b=2310 it collapses |Delta| far below |delta(1)| and flips r to r<0 at the ~1e-6 floor -- exactly the imp-97140 exceptions.',
  },
  {
    id: 'imp97167-honesty-gate-no-qed',
    holds: () =>
      IMP97167_VERDICT.anyBoundMoved === false &&
      IMP97167_VERDICT.postsRigorousCeiling === false &&
      IMP97167_VERDICT.qed === false &&
      IMP97167_VERDICT.suppliesUniformSignCertificate === false &&
      /uniform/.test(IMP97167_SUBGAP.statement) &&
      /NO QED/.test(IMP97167_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97167_HONEST_BANNER) &&
      /RH open/.test(IMP97167_HONEST_BANNER),
    why: 'derivation of an empirical sign law with the leading term and collapse mechanism derived, but no uniform non-cancellation certificate supplied (named residual) -- no bound moved, no rigorous ceiling, no QED.',
  },
];

for (const a of IMP97167_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97167-route-m-parity-sign-law-derivation assertion failed: ${a.id}`,
    );
  }
}

export default {
  kappaArith: IMP97167_KAPPA_ARITH,
  K: IMP97167_K,
  identities: IMP97167_IDENTITIES,
  signLaw: IMP97167_SIGN_LAW,
  verdict: IMP97167_VERDICT,
  subGap: IMP97167_SUBGAP,
  banner: IMP97167_HONEST_BANNER,
};
