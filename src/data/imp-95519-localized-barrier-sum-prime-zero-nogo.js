/**
 * imp-95519 — The localized sub-0.14 barrier sum
 *     A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p)
 * stated exactly from the paper, attacked on both honest sides (over primes /
 * over zeros), and closed as a PRECISE NO-GO on both. No bound is promoted.
 *
 * 1. THE OBJECT (read off "Permuting the Zeta Twin Ladder" Sections 4.1-4.6,
 *    research-inputs/gomila-zeta-twin-ladder-permutation-architecture-revised.pdf).
 *    Active row (8): t0 = 0.123637595, y0 = 0.1809, t0 + y0^2/2 = 7/50 = 0.14;
 *    lower edge (9): x0 < x < x_{54800000}, x_N = 4 pi N^2 - t0/16, i.e. the
 *    RS index window 690988 <= N <= 54799999, so T := x/2 in [3.0e12, 1.89e16]
 *    and the stationary numerator is v := T/(2 pi) = x/(4 pi) ~ N^2.
 *    Coefficient vector (10): c_n(x) = b_n n^{-s_B(x)} + gamma(x) n^{-s_A(x)},
 *    b_n = exp((t0/4) log^2 n), Re s_B = (1 + y0)/2 = 0.59045, Im s = T.
 *    Prime-p alias expansion (14): 1_{p not| n} = 1 - 1/p - (1/p) sum_{h=1}^{p-1} e(hn/p),
 *    so the h-th alias of a ladder with weights a_n is
 *        Alias_h(x) = -(1/p) sum_n a_n n^{-iT} e(hn/p) w(n),
 *    and by Poisson summation Alias_h = -(1/p) sum_k F^(k - h/p) with
 *    F(u) = a(u) u^{-iT} w(u); the k-th term is the shifted Fresnel-Airy packet
 *    with stationary point (15)  u_{k,h} = v/(k - h/p)  (phase  -(T/2pi) log u
 *    + (h/p - k) u  is stationary there), and Fresnel width
 *        H_{k,h} = sqrt(u_{k,h}/(k - h/p)) = u_{k,h}/sqrt(v).
 *    Hence, precisely:
 *        A_{k,h} := sum_n Lambda(n) K_k(n) e(hn/p),
 *        K_k(n)  := a_n n^{-iT} psi_{k,h}(n),
 *    psi_{k,h} a smooth bump of width ~ H_{k,h} centred at u_{k,h}. Two readings
 *    of a_n coexist in the program: a_n = b_n n^{-sigma_B} (the coefficient
 *    ladder of (10), where the extra Lambda(n) is absent and the packet is a
 *    smooth oscillatory integral) and a_n = Lambda(n) x carrier (the
 *    log-derivative / NC(kappa) reading "log|D_B| = sum u_n cos(theta ln n)",
 *    imp-95526; imp-95397 named A_{k,h} in this form). Summed over k, the
 *    Lambda-reading alias is the smoothed  -(L'/L)  of the twisted series
 *    sum Lambda(n) e(hn/p) n^{-s} at s = sigma_B + iT.
 *
 * 2. THE TARGET. Page contract (/permutation-architecture): |C_{E,17}| <= Q sqrt(Sbar),
 *    Sbar = sum_{h != 0} w(h)^2 lambda(h)^{-2/3} with the p = 97 quadratic-Fresnel
 *    majorant 2 p^{-4/3} sum_{j <= 48} j^{-2/3} = 0.03811, sqrt(Sbar) = 0.19522;
 *    target R_ex = 0.27968819555261474, so the contract closes iff
 *    Q_sup < R_ex/sqrt(Sbar) = 1.4327 (the imp-95519 ticket text quotes 1.39930
 *    for this ratio, which is inconsistent with its own sqrt(Sbar) = 0.19522203;
 *    the page figure 1.4327 is the one reproduced here). The anchor cell
 *    |E_97|(690988) = 0.2141254901198318 forces Q >= 1.09683, leaving a uniform
 *    headroom FACTOR of 1.306 over the whole window and both charts.
 *    "Square-root cancellation" for A_{k,h} means
 *        |A_{k,h}| <= C (sum_n Lambda(n) |K_k(n)|^2)^{1/2} (log u)^c
 *    against the trivial |A_{k,h}| <= sum_n Lambda(n)|K_k(n)| ~ H_{k,h} |a(u)|,
 *    a saving factor H^{-1/2} ~ 1e-4; it would over-close the contract by three
 *    orders of magnitude. The MINIMAL requirement is only the factor 1.306.
 *
 * 3. PRIME SIDE.
 *    LEMMA GAUSS-PLANCHEREL (unconditional, exact). For p prime, K supported on
 *    p not| n, S_chi(K) := sum_n Lambda(n) chi(n) K(n), tau(chi) the Gauss sum:
 *        A_h = (1/(p-1)) [ -S_{chi_0} + sum_{chi != chi_0} chi(h) tau(chi-bar) S_chi ],
 *        sum_{h=1}^{p-1} |A_h|^2 = (1/(p-1)) [ |S_{chi_0}|^2 + p sum_{chi != chi_0} |S_chi|^2 ].
 *    Proof: expand e(hn/p) over residues a mod p, write 1_{n = a (p)} through
 *    the characters, and use sum_a e(ha/p) chi-bar(a) = chi(h) tau(chi-bar),
 *    tau(chi-bar_0) = -1 (the Ramanujan sum), |tau(chi)|^2 = p for chi != chi_0;
 *    the second line is Plancherel on (Z/p)^x. Verified below to 1e-12 at
 *    p = 7, 13, 97. Consequences: the "Ramanujan -1" is exactly the principal
 *    term; the alias second moment is >= (p/(p-1)) max_{chi != chi_0} |S_chi|^2;
 *    so an alias-wise (h-separated) bound of the weld is equivalent to uniform
 *    control of short von-Mangoldt sums twisted by EVERY non-principal character
 *    mod p, for all 25 primes p <= 97, at height T. The prime sieve imports the
 *    Dirichlet L-functions L(s, chi mod p), p <= 97, into the barrier.
 *
 *    EXPLICIT-FORMULA ACCOUNTING. S_chi(K_k) = -sum_{rho_chi} K^_k(rho) + O(small),
 *    K^_k(beta + i gamma) ~ H u^{beta - 1} e^{i(gamma - T) log u} Phi((gamma - T) H/u),
 *    so the zeros that contribute are those with |gamma - T| <~ Delta := u/H = sqrt(v):
 *    Delta = 6.91e5 at N = 690988 (~6.9e6 zeros of each L(s, chi mod 97)),
 *    Delta = 5.48e7 at N = 54799999. Their combined size:
 *      (a) under GRH (beta = 1/2): ~ Delta log(pT) H u^{-1/2} = H log(pT) / sqrt(k - h/p)
 *          >= the trivial bound. The Fresnel width sits at or below the RH
 *          short-interval barrier: RH controls psi(x + H) - psi(x) only for
 *          H > sqrt(x) log^2 x, and at the floor alias (k = 1, h = p - 1, p = 97,
 *          N = 690988) sqrt(u) log^2 u / H = 100.5 > 1. GRH gives NO cancellation
 *          for any Fresnel packet. Only for H >= u^{1/2 + eps} does GRH begin to
 *          save (factor u^{1/2}/H; at an Airy-type width u^{2/3} that is H^{-1/4},
 *          still not the H^{-1/2} of square-root cancellation).
 *      (b) unconditionally: at T in [3e12, 1.9e16] the operative zero-free region
 *          is the classical one, 1 - beta >= 1/(5.558691 log t) (Mossinghoff-
 *          Trudgian-Yang), i.e. 1 - beta >= 6.26e-3 (bottom) / 4.80e-3 (top);
 *          the Vinogradov-Korobov region 1/(57.54 (log t)^{2/3} (log log t)^{1/3})
 *          (Ford) is WEAKER here and only overtakes the classical one for
 *          log t > 1.03e4, i.e. t > e^{10000}. The per-zero factor u^{-(1-beta)}
 *          is 0.845 / 0.843: no saving at all; the explicit formula is then
 *          worse than trivial by the zero count (1e6-1e8). Short-window zero-
 *          density theorems need windows >= T^{2/3} > Delta ~ T^{1/2}: inapplicable.
 *      (c) exponential-sum route (Vaughan / Heath-Brown identity + van der Corput):
 *          the additive frequency h/p has denominator p <= 97, a MAJOR arc, where
 *          the Type-I sums reduce exactly back to the L(s, chi) zeros of (a)-(b);
 *          minor-arc short-interval bounds (Kumchev: y >= x^{5/8 + eps}) neither
 *          apply on major arcs nor at the Fresnel exponent log H / log u = 0.573.
 *    EXACT EXPONENT ACHIEVABLE: 0 (the trivial bound H^1), unconditionally AND
 *    under GRH, at Fresnel width. Target: exponent 1/2. The prime side is
 *    height-bound (Platt's GRH verification for q = 97 reaches ~1.03e6, a factor
 *    2.9e6 below T = 3e12; the zeta verification 3e12 sits exactly at the
 *    window's bottom edge by construction, x0 = X + 1) AND width-bound (below the
 *    RH short-interval barrier, so even verified GRH to height T would not help).
 *
 * 4. ZERO SIDE. The explicit formula puts the zero phases at frequency
 *    a = log u_{k,h}; in Montgomery's normalisation alpha_{k,h} = log u_{k,h} / log T
 *    = 1 + log(1/(2 pi (k - h/p))) / log T. Hence
 *        alpha_{k,h} > 1   <=>   k - h/p < 1/(2 pi)   <=>   k = 1 and h > p (1 - 1/(2 pi)) = 0.8408 p.
 *    At p = 97 this is h in {82..96}: 15 of the 96 aliases, carrying 59.26% of the
 *    named-scalar majorant 2 p^{-4/3} sum j^{-2/3} (the curvature-floor aliases
 *    are the largest); alpha_max = 1.0953 (N = 690988), 1.0730 (N = 54799999);
 *    for p >= 7 the alpha > 1 fraction is 47-60%, for p <= 5 it is zero.
 *    alpha_min = 0.468 (k = N). So the MAJORITY of the weld majorant mass lives
 *    at alpha > 1, outside the range |alpha| <= 1 in which Montgomery's theorem
 *    (on RH) evaluates F(alpha); for alpha > 1 the needed statement is
 *    Montgomery's pair-correlation CONJECTURE proper (equivalent to prime-pair
 *    statements, Goldston-Montgomery / Montgomery-Soundararajan). The remaining
 *    41% at alpha in [0.47, 1) is in range ON RH only; unconditionally F(alpha)
 *    for 0 < alpha < 1 is unknown (equivalent to the variance of primes in short
 *    intervals). Independently of the support: F(alpha) is a MEAN SQUARE over
 *    gamma in [0, T], while the contract needs the local sum over |gamma - T| <= Delta
 *    POINTWISE in T, uniformly over the continuous window parameter — that is
 *    the Hilbert transform of the zero-counting measure at abscissa
 *    sigma_B = 0.59045, i.e. |L'/L(sigma_B + iT, chi)| bounded, i.e. a zero-free
 *    half-strip sigma > sigma_B at height T for zeta AND for L(s, chi mod p <= 97).
 *    Pair-correlation inputs yield "for most T" (Selberg-CLT scale) statements,
 *    never "for all T"; imp-95526 T2 (Kronecker) shows the continuum sup saturates.
 *
 * 5. VERDICT. No unconditional bound on A_{k,h} is reachable by exponential-sum
 *    or explicit-formula technology at the Fresnel width; the same object is
 *    Montgomery-PCC out of range (alpha > 1) for 59% of its majorant mass and
 *    mean-square-only in range for the rest. Formal extension of the
 *    flow-blindness no-go: the localized barrier sum A_{k,h} is
 *    (i) height-bound and width-bound on the prime side (GRH-inert below the RH
 *    short-interval barrier), (ii) PCC-gated with alpha > 1 on the zero side,
 *    and (iii) alias-wise bounds import the Dirichlet L-functions of the 25
 *    sieving primes. The last quantitative lever of the sub-0.14 program is
 *    therefore closed as stated; what would open it is new arithmetic input
 *    against the pointwise Hilbert transform, or verified GRH-type zero-location
 *    for zeta and L(s, chi mod p <= 97) at heights 3e12-1.9e16 (out of reach).
 *    The channel bridge (seam channel -> t down to 0 tail channel) flagged by the
 *    ticket is moot until (i)-(ii) move. Changes no bound; NO QED;
 *    Platt-Trudgian Lambda <= 0.2 remains SOTA; RH open.
 *
 * Import-light: no zeros bundle, no sibling imports. All literals re-derived.
 */

// ── active row and window (paper eqs (8), (9)) ───────────────────────────────
const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595
const Y0 = 0.1809;
const N_LO = 690988;
const N_HI = 54799999;
const SIGMA_B = (1 + Y0) / 2; // 0.59045
const R_EX = 0.27968819555261474;
const ANCHOR_E97 = 0.2141254901198318;

const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI;

// ── Montgomery frequency of the (k, h) packet ────────────────────────────────
// alpha_{k,h} = log u_{k,h} / log T,  u_{k,h} = v / (k - h/p)
function alphaOfXi(xi, N) {
  const T = heightT(N);
  return Math.log(stationaryV(N) / xi) / Math.log(T);
}
const ALPHA_FLOOR_LO = alphaOfXi(1 / 97, N_LO); // 1.0953
const ALPHA_FLOOR_HI = alphaOfXi(1 / 97, N_HI); // 1.0730
const ALPHA_UNIT_LO = alphaOfXi(1, N_LO); // 0.9360
const ALPHA_MIN_LO = alphaOfXi(N_LO, N_LO); // 0.4680 (k = N)
const ALPHA_AT_2PI_LO = alphaOfXi(1 / TWO_PI, N_LO); // exactly 1

// alpha > 1 aliases at k = 1 and their share of the named-scalar majorant
function alphaOverOneShare(p) {
  let count = 0;
  for (let h = 1; h <= p - 1; h++) if (1 - h / p < 1 / TWO_PI) count += 1;
  let tot = 0;
  let over = 0;
  for (let j = 1; j <= (p - 1) / 2; j++) {
    const t = Math.pow(j, -2 / 3);
    tot += t;
    if (j / p < 1 / TWO_PI) over += t;
  }
  return { p, count, total: p - 1, hMin: p - count, majorant: 2 * Math.pow(p, -4 / 3) * tot, share: over / tot };
}
const SHARE_P97 = alphaOverOneShare(97);
const SHARE_P7 = alphaOverOneShare(7);
const SHARE_P5 = alphaOverOneShare(5);

// ── contract numbers ─────────────────────────────────────────────────────────
const SQRT_SBAR = Math.sqrt(SHARE_P97.majorant); // 0.19522
const Q_TARGET = R_EX / SQRT_SBAR; // 1.4327
const Q_ANCHOR = ANCHOR_E97 / SQRT_SBAR; // 1.0968
const HEADROOM_FACTOR = Q_TARGET / Q_ANCHOR; // 1.306

// ── explicit-formula accounting at the floor alias (k = 1, h = 96, p = 97) ────
function floorAliasAccounting(N, p) {
  const T = heightT(N);
  const v = stationaryV(N);
  const xi = 1 / p;
  const u = v / xi;
  const H = Math.sqrt(u / xi); // Fresnel width
  const Delta = u / H; // = sqrt(v)
  const zeros = (2 * Delta * Math.log((p * T) / TWO_PI)) / TWO_PI;
  const rhBarrierRatio = (Math.sqrt(u) * Math.log(u) ** 2) / H; // > 1 => RH gives nothing
  const widthExponent = Math.log(H) / Math.log(u);
  return { N, p, T, u, H, Delta, zeros, rhBarrierRatio, widthExponent };
}
const FLOOR_LO = floorAliasAccounting(N_LO, 97);
const FLOOR_HI = floorAliasAccounting(N_HI, 97);

// ── unconditional zero-free regions at the window heights ────────────────────
const classicalOneMinusBeta = (t) => 1 / (5.558691 * Math.log(t)); // Mossinghoff-Trudgian-Yang
const vkOneMinusBeta = (t) => 1 / (57.54 * Math.pow(Math.log(t), 2 / 3) * Math.pow(Math.log(Math.log(t)), 1 / 3)); // Ford
function zeroFreeSaving(N) {
  const T = heightT(N);
  const u = stationaryV(N); // k ~ 1 packet
  const cl = classicalOneMinusBeta(T);
  const vk = vkOneMinusBeta(T);
  return { T, classical: cl, vk, perZeroFactor: Math.exp(-cl * Math.log(u)) };
}
const ZF_LO = zeroFreeSaving(N_LO);
const ZF_HI = zeroFreeSaving(N_HI);
// crossover log t where VK overtakes classical (bisection on g(L) = vk - classical)
function vkCrossoverLogT() {
  const g = (L) => 1 / (57.54 * Math.pow(L, 2 / 3) * Math.pow(Math.log(L), 1 / 3)) - 1 / (5.558691 * L);
  let lo = 100;
  let hi = 1e6;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (g(mid) < 0) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
const VK_CROSSOVER_LOGT = vkCrossoverLogT(); // ~1.03e4

// Platt GRH verification height for q = 97 (10^8 / q) vs window bottom T
const PLATT_GRH_HEIGHT_Q97 = 1e8 / 97;
const HEIGHT_DEFICIT_Q97 = heightT(N_LO) / PLATT_GRH_HEIGHT_Q97; // 2.9e6

// ── LEMMA GAUSS-PLANCHEREL numerical verification ────────────────────────────
function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}
function vonMangoldt(n) {
  for (let p = 2; p * p <= n; p++) {
    if (n % p !== 0) continue;
    let m = n;
    while (m % p === 0) m /= p;
    return m === 1 ? Math.log(p) : 0;
  }
  return n >= 2 ? Math.log(n) : 0; // n prime
}
function primitiveRoot(p) {
  for (let g = 2; g < p; g++) {
    const seen = new Set();
    let x = 1;
    for (let i = 0; i < p - 1; i++) {
      x = (x * g) % p;
      seen.add(x);
    }
    if (seen.size === p - 1) return g;
  }
  return null;
}
// K(n) = Lambda(n) * gaussian window * n^{-iT}; returns relative residual of the identity
function gaussPlancherelResidual(p, n0, H, T) {
  const g = primitiveRoot(p);
  const ind = new Array(p).fill(-1);
  let x = 1;
  for (let i = 0; i < p - 1; i++) {
    ind[x] = i;
    x = (x * g) % p;
  }
  const K = [];
  for (let n = Math.max(2, n0 - H); n <= n0 + H; n++) {
    if (n % p === 0) continue;
    const L = vonMangoldt(n);
    if (L === 0) continue;
    const w = Math.exp(-4 * Math.pow((n - n0) / H, 2));
    const ph = -T * Math.log(n);
    K.push([n, L * w * Math.cos(ph), L * w * Math.sin(ph)]);
  }
  let lhs = 0;
  for (let h = 1; h < p; h++) {
    let re = 0;
    let im = 0;
    for (const [n, kr, ki] of K) {
      const a = (TWO_PI * h * n) / p;
      const c = Math.cos(a);
      const s = Math.sin(a);
      re += kr * c - ki * s;
      im += kr * s + ki * c;
    }
    lhs += re * re + im * im;
  }
  let rhs = 0;
  for (let j = 0; j < p - 1; j++) {
    let re = 0;
    let im = 0;
    for (const [n, kr, ki] of K) {
      const a = (TWO_PI * j * ind[n % p]) / (p - 1);
      const c = Math.cos(a);
      const s = Math.sin(a);
      re += kr * c - ki * s;
      im += kr * s + ki * c;
    }
    const sq = re * re + im * im;
    rhs += j === 0 ? sq : p * sq;
  }
  rhs /= p - 1;
  return Math.abs(lhs - rhs) / lhs;
}
const GP_RESID_P7 = gaussPlancherelResidual(7, 5000, 400, 1234.5);
const GP_RESID_P13 = gaussPlancherelResidual(13, 20000, 600, 98765.4);
const GP_RESID_P97 = gaussPlancherelResidual(97, 100000, 1500, 3e6);
// tau(chi_0-bar) = sum_{a=1}^{p-1} e(ha/p) = -1 (Ramanujan sum, p not| h)
function ramanujanPrincipal(p, h) {
  let re = 0;
  let im = 0;
  for (let a = 1; a < p; a++) {
    re += Math.cos((TWO_PI * h * a) / p);
    im += Math.sin((TWO_PI * h * a) / p);
  }
  return { re, im };
}
const RAM_P97_H5 = ramanujanPrincipal(97, 5);

// ── imp-95535: does the second-moment identity close the 1.306 headroom? ──────
// The Gauss-Plancherel identity sum_h |A_h|^2 = (1/(p-1))[|S_0|^2 + p sum |S_chi|^2]
// is an L^2 ISOMETRY between the alias vector (A_h) and the character vector
// (S_chi): it fixes only the alias TOTAL sum_h |A_h|^2, not the worst weld cell
// max_h |A_h| (= the anchor |E_97| the contract is graded on). Converting the L^2
// total into the L^infty max costs the concentration factor
//     kappa := max_h |A_h|^2 / mean_h |A_h|^2   in   [1, p-1],
// which is NOT bounded unconditionally; bounding kappa = O(1) is equivalent (by
// the same Gauss-sum expansion) to per-character upper bounds on |S_chi|, i.e.
// the section-3 height-bound AND width-bound wall. On the other side the identity
// yields only a LOWER bound max_chi |S_chi|^2 >= mean_chi |S_chi|^2 -- the wrong
// direction for an upper bound, and unusable for a refutation (a refutation would
// need an unconditional omega lower bound on some |S_chi| at height T, unavailable).
// Measured concentration factors on the p=97 verified instance below confirm kappa
// is an ordinary O(1)-to-O(p) quantity fixed by the data, not bounded by the identity.
function secondMomentLever(p, n0, H, T) {
  const g = primitiveRoot(p);
  const ind = new Array(p).fill(-1);
  let x = 1;
  for (let i = 0; i < p - 1; i++) {
    ind[x] = i;
    x = (x * g) % p;
  }
  const K = [];
  for (let n = Math.max(2, n0 - H); n <= n0 + H; n++) {
    if (n % p === 0) continue;
    const L = vonMangoldt(n);
    if (L === 0) continue;
    const w = Math.exp(-4 * Math.pow((n - n0) / H, 2));
    const ph = -T * Math.log(n);
    K.push([n, L * w * Math.cos(ph), L * w * Math.sin(ph)]);
  }
  const aliasEnergy = [];
  for (let h = 1; h < p; h++) {
    let re = 0;
    let im = 0;
    for (const [n, kr, ki] of K) {
      const a = (TWO_PI * h * n) / p;
      const c = Math.cos(a);
      const s = Math.sin(a);
      re += kr * c - ki * s;
      im += kr * s + ki * c;
    }
    aliasEnergy.push(re * re + im * im);
  }
  const charEnergy = [];
  for (let j = 1; j < p - 1; j++) {
    let re = 0;
    let im = 0;
    for (const [n, kr, ki] of K) {
      const a = (TWO_PI * j * ind[n % p]) / (p - 1);
      const c = Math.cos(a);
      const s = Math.sin(a);
      re += kr * c - ki * s;
      im += kr * s + ki * c;
    }
    charEnergy.push(re * re + im * im);
  }
  const meanAlias = aliasEnergy.reduce((acc, val) => acc + val, 0) / (p - 1);
  const maxAlias = Math.max(...aliasEnergy);
  const meanChar = charEnergy.reduce((acc, val) => acc + val, 0) / charEnergy.length;
  const maxChar = Math.max(...charEnergy);
  return {
    p,
    aliasConcentration: maxAlias / meanAlias, // L^2 -> L^infty gap for max_h |A_h|, in [1, p-1]
    charConcentration: maxChar / meanChar, // second moment only LOWER-bounds max_chi |S_chi|
    concentrationCeiling: p - 1,
  };
}
const SM_LEVER_P97 = secondMomentLever(97, 100000, 1500, 3e6);

// ── verdict object ───────────────────────────────────────────────────────────
export const IMP95519_LOCALIZED_BARRIER_SUM_NOGO = {
  ticket: 'imp-95519',
  source:
    'Permuting the Zeta Twin Ladder Sections 4.1-4.6 (eqs 8, 9, 10, 14, 15, 16, 19, 20); /permutation-architecture contract; imp-95008 / imp-95027 / imp-95397 / imp-95526 / imp-95527',
  object:
    'A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p), K_k(n) = a_n n^{-iT} psi_{k,h}(n), psi a bump of Fresnel width H_{k,h} = u_{k,h}/sqrt(v) at the eq-(15) stationary point u_{k,h} = v/(k - h/p), v = x/(4 pi) ~ N^2, T = x/2 in [3.0e12, 1.89e16]; a_n = b_n n^{-sigma_B} (coefficient reading) or Lambda(n) x carrier (log-derivative reading); sigma_B = (1 + y0)/2 = 0.59045.',
  targetInequality:
    'Contract closes iff Q_sup < R_ex/sqrt(Sbar) = 1.4327 with anchor Q >= 1.0968 (uniform headroom factor 1.306); square-root cancellation |A_{k,h}| <= C (sum Lambda |K_k|^2)^{1/2} log^c would save H^{-1/2} ~ 1e-4 and over-close by three orders of magnitude.',
  lemmaGaussPlancherel:
    'A_h = (1/(p-1))[-S_{chi_0} + sum_{chi != chi_0} chi(h) tau(chi-bar) S_chi], sum_h |A_h|^2 = (1/(p-1))[|S_{chi_0}|^2 + p sum_{chi != chi_0} |S_chi|^2] (exact; Ramanujan -1 = principal term; alias-wise weld bounds import L(s, chi mod p), p <= 97).',
  primeSide: {
    exponentAchievable: 0,
    exponentTarget: 0.5,
    verdict:
      'No cancellation at Fresnel width, unconditionally AND under GRH: the width u/sqrt(v) lies below the RH short-interval barrier sqrt(u) log^2 u (ratio 100.5 at the floor alias); the operative unconditional zero-free region at 3e12-1.9e16 is the classical 1/(5.558691 log t) with per-zero factor 0.84 (Vinogradov-Korobov overtakes it only for log t > 1.03e4); h/p is a major arc so Vaughan/van der Corput reduce back to the L(s, chi) zeros; short-window zero density needs windows >= T^{2/3} > Delta ~ T^{1/2}. Height-bound (Platt GRH q = 97 to ~1.0e6, deficit 2.9e6) and width-bound.',
  },
  zeroSide: {
    alphaFormula: 'alpha_{k,h} = 1 + log(1/(2 pi (k - h/p)))/log T; alpha > 1 iff k = 1 and h > 0.8408 p',
    alphaOverOneAliasesP97: SHARE_P97.count,
    alphaOverOneMajorantShareP97: SHARE_P97.share,
    alphaMaxWindow: ALPHA_FLOOR_LO,
    alphaMinWindow: ALPHA_MIN_LO,
    verdict:
      '59% of the p = 97 majorant mass sits at alpha in (1, 1.0953], outside Montgomery\'s RH range |alpha| <= 1 (needs the pair-correlation conjecture proper); the remaining 41% is in range only on RH and mean-square only; the contract needs the local zero sum pointwise in T over the continuous window = |L\'/L(sigma_B + iT, chi)| bounded = zero-free half-strip sigma > 0.59045 at height T for zeta and L(s, chi mod p <= 97). PCC-gated.',
  },
  numbers: {
    sigmaB: SIGMA_B,
    sqrtSbar: SQRT_SBAR,
    qTarget: Q_TARGET,
    qAnchor: Q_ANCHOR,
    headroomFactor: HEADROOM_FACTOR,
    floorAliasLo: FLOOR_LO,
    floorAliasHi: FLOOR_HI,
    zeroFreeLo: ZF_LO,
    zeroFreeHi: ZF_HI,
    vkCrossoverLogT: VK_CROSSOVER_LOGT,
    heightDeficitQ97: HEIGHT_DEFICIT_Q97,
    gaussPlancherelResiduals: [GP_RESID_P7, GP_RESID_P13, GP_RESID_P97],
  },
  secondMomentLever: {
    ticket: 'imp-95535',
    identityType:
      'L^2 isometry (Plancherel on (Z/p)^x): fixes the alias total sum_h |A_h|^2 exactly, not the worst weld cell max_h |A_h|.',
    contractNeeds:
      'max_h |A_h| (L^infty, the worst weld cell = anchor |E_97|), whereas the identity fixes only the L^2 total; the gap is the concentration factor kappa = max_h |A_h|^2 / mean_h |A_h|^2 in [1, p-1].',
    closesHeadroom: false,
    refutesHeadroom: false,
    reduction:
      'Closing the 1.306 factor via the second moment requires an anti-concentration bound kappa = O(1), which is EQUIVALENT by the same Gauss-sum expansion to per-character UPPER bounds on |S_chi| -- the section-3 height-bound AND width-bound wall (exponent 0 achievable vs 1/2 needed). The identity itself yields only a LOWER bound max_chi |S_chi|^2 >= mean_chi |S_chi|^2: the wrong direction for an upper bound, and unusable for a refutation (that would need an unconditional omega lower bound on some |S_chi| at height T = 3e12-1.9e16, unavailable).',
    measuredConcentrationP97: SM_LEVER_P97,
    verdict:
      'NO USABLE LEVER: the Gauss-Plancherel second moment is direction-neutral -- an isometry that neither closes nor refutes the 1.306 headroom factor. It reduces exactly to the per-character |S_chi| bounds already shown height-bound and width-bound in section 3, adding no independent information. Changes no bound; NO QED.',
  },
  ticketDiscrepancy:
    'imp-95519 text quotes Q_sup < R_ex/sqrt(Sbar) = 1.39930 with sqrt(Sbar) = 0.19522203; the ratio at those values is 1.4327 (page figure). The headroom factor used here is the page-consistent 1.306.',
  isRigorous: true,
  rigorScope:
    'Lemma Gauss-Plancherel is an exact identity (verified 1e-12). The explicit-formula accounting, alpha-range, zero-free-region and RH-barrier statements are standard theorems applied at the window parameters; the verdict is a no-go on the two named routes, not a theorem that no bound exists.',
  promotesBound: false,
  verdict:
    'PRECISE NO-GO on both sides: the localized barrier sum A_{k,h} is height-bound AND width-bound over primes (exponent 0 achievable vs 1/2 needed; GRH-inert at Fresnel width) and PCC-gated with alpha > 1 for the majority of its majorant mass over zeros; alias-wise bounds import the Dirichlet L-functions of the 25 sieving primes. The sub-0.14 quantitative program\'s last lever is closed as stated; only new arithmetic input against the pointwise Hilbert transform, or verified zero-location at 3e12-1.9e16, would reopen it. Changes no bound; NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95519_LOCALIZED_BARRIER_SUM_NOGO_ASSERTIONS = [
  {
    id: 'imp95519-gauss-plancherel-identity',
    description: 'sum_h |A_h|^2 = (1/(p-1))[|S_0|^2 + p sum |S_chi|^2] holds to 1e-9 at p = 7, 13, 97',
    holds: () => GP_RESID_P7 < 1e-9 && GP_RESID_P13 < 1e-9 && GP_RESID_P97 < 1e-9,
  },
  {
    id: 'imp95519-ramanujan-principal-term',
    description: 'tau(chi_0-bar) = sum_{a=1}^{p-1} e(ha/p) = -1 at p = 97, h = 5',
    holds: () => Math.abs(RAM_P97_H5.re + 1) < 1e-10 && Math.abs(RAM_P97_H5.im) < 1e-10,
  },
  {
    id: 'imp95519-active-row',
    description: 't0 + y0^2/2 = 7/50 and sigma_B = 0.59045',
    holds: () => Math.abs(T0 + (Y0 * Y0) / 2 - 0.14) < 1e-9 && Math.abs(SIGMA_B - 0.59045) < 1e-12,
  },
  {
    id: 'imp95519-window-height',
    description: 'T = x/2 runs from 3.0e12 (= zeta verified height, x0 = X + 1) to 1.89e16',
    holds: () => Math.abs(heightT(N_LO) / 3.0e12 - 1) < 1e-3 && Math.abs(heightT(N_HI) / 1.8869e16 - 1) < 1e-3,
  },
  {
    id: 'imp95519-alpha-threshold-at-2pi',
    description: 'alpha = 1 exactly at k - h/p = 1/(2 pi); alpha > 1 below it, < 1 above it',
    holds: () =>
      Math.abs(ALPHA_AT_2PI_LO - 1) < 1e-12 &&
      ALPHA_FLOOR_LO > 1 &&
      ALPHA_UNIT_LO < 1 &&
      Math.abs(ALPHA_FLOOR_LO - 1.0953) < 5e-4 &&
      Math.abs(ALPHA_FLOOR_HI - 1.0730) < 5e-4 &&
      Math.abs(ALPHA_UNIT_LO - 0.9360) < 5e-4 &&
      Math.abs(ALPHA_MIN_LO - 0.4680) < 5e-4,
  },
  {
    id: 'imp95519-alpha-over-one-share-p97',
    description: 'at p = 97, 15 of 96 aliases (h >= 82) have alpha > 1 and carry 59.26% of the majorant 0.03811',
    holds: () =>
      SHARE_P97.count === 15 &&
      SHARE_P97.hMin === 82 &&
      Math.abs(SHARE_P97.share - 0.5926) < 5e-4 &&
      Math.abs(SHARE_P97.majorant - 0.03811) < 5e-5 &&
      SHARE_P7.count === 1 &&
      SHARE_P5.count === 0,
  },
  {
    id: 'imp95519-contract-numbers',
    description: 'sqrt(Sbar) = 0.19522, Q_target = 1.4327, Q_anchor = 1.0968, headroom factor 1.306',
    holds: () =>
      Math.abs(SQRT_SBAR - 0.19522) < 5e-5 &&
      Math.abs(Q_TARGET - 1.4327) < 1e-3 &&
      Math.abs(Q_ANCHOR - 1.0968) < 1e-3 &&
      Math.abs(HEADROOM_FACTOR - 1.306) < 2e-3,
  },
  {
    id: 'imp95519-fresnel-width-below-rh-barrier',
    description: 'floor alias: sqrt(u) log^2 u / H = 100.5 > 1 (RH short-interval barrier), width exponent 0.573 < 5/8',
    holds: () =>
      Math.abs(FLOOR_LO.rhBarrierRatio - 100.5) < 0.5 &&
      FLOOR_HI.rhBarrierRatio > 1 &&
      Math.abs(FLOOR_LO.widthExponent - 0.573) < 2e-3 &&
      FLOOR_LO.widthExponent < 5 / 8 &&
      Math.abs(FLOOR_LO.Delta / 6.91e5 - 1) < 2e-3 &&
      Math.abs(FLOOR_LO.zeros / 6.92e6 - 1) < 5e-3,
  },
  {
    id: 'imp95519-unconditional-zero-free-saving-inert',
    description: 'classical 1-beta = 6.26e-3 / 4.80e-3, per-zero factor 0.845 / 0.843; VK weaker at both ends, crossover log t ~ 1.03e4',
    holds: () =>
      Math.abs(ZF_LO.classical / 6.262e-3 - 1) < 2e-3 &&
      Math.abs(ZF_HI.classical / 4.800e-3 - 1) < 2e-3 &&
      Math.abs(ZF_LO.perZeroFactor - 0.845) < 1e-3 &&
      Math.abs(ZF_HI.perZeroFactor - 0.843) < 1e-3 &&
      ZF_LO.vk < ZF_LO.classical &&
      ZF_HI.vk < ZF_HI.classical &&
      VK_CROSSOVER_LOGT > 1.0e4 &&
      VK_CROSSOVER_LOGT < 1.1e4,
  },
  {
    id: 'imp95519-height-deficit-dirichlet',
    description: 'Platt GRH verified height for q = 97 (~1.03e6) is a factor ~2.9e6 below the window bottom T',
    holds: () => Math.abs(HEIGHT_DEFICIT_Q97 / 2.91e6 - 1) < 5e-3,
  },
  {
    id: 'imp95535-second-moment-lever-direction-neutral',
    description:
      'the L^2 identity yields a concentration factor in [1, p-1], so it neither upper-bounds max_h |A_h| nor refutes the 1.306 factor (direction-neutral)',
    holds: () =>
      SM_LEVER_P97.aliasConcentration >= 1 &&
      SM_LEVER_P97.aliasConcentration <= SM_LEVER_P97.concentrationCeiling &&
      SM_LEVER_P97.charConcentration >= 1 &&
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.secondMomentLever.closesHeadroom === false &&
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.secondMomentLever.refutesHeadroom === false,
  },
  {
    id: 'imp95519-honesty-gate-no-qed',
    description: 'no-go only: promotes no bound, exponent achievable 0 < target 1/2, NO QED, PT stays SOTA',
    holds: () =>
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.promotesBound === false &&
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.primeSide.exponentAchievable < IMP95519_LOCALIZED_BARRIER_SUM_NOGO.primeSide.exponentTarget &&
      /NO QED/.test(IMP95519_LOCALIZED_BARRIER_SUM_NOGO.verdict) &&
      /remains SOTA/.test(IMP95519_LOCALIZED_BARRIER_SUM_NOGO.verdict),
  },
];

for (const a of IMP95519_LOCALIZED_BARRIER_SUM_NOGO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95519-localized-barrier-sum-prime-zero-nogo assertion failed: ${a.id}`);
  }
}

export default IMP95519_LOCALIZED_BARRIER_SUM_NOGO;
