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
 *          log t > 1.0242e4 (10242.24; imp-95619 canonical value -- "1.03e4"
 *          was an imprecise rounding gloss), i.e. t > e^{10000}. The per-zero factor u^{-(1-beta)}
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
 *    HONEST SCOPE (imp-95604 audit): this imp-95526 T2 Kronecker citation forecloses
 *    only the mean-square -> pointwise UPGRADE mechanism (the sqrt(H) transfer
 *    constant is Kronecker-sharp and exactly cancels the H^{-1/2} mean-square saving,
 *    returning the trivial size); it must NOT be over-read as REFUTING the anchor
 *    contract. Kronecker exhibits a positive-measure saturating set but does NOT
 *    locate it at the anchor height T-star, so the contract there stays UNDECIDED /
 *    PCC-gated -- neither closed nor broken by this argument.
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
 *    no refereed bound is changed; RH open.
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

// ── imp-95580: RH short-interval-barrier ratio rho over the FULL (k,h) alias grid and N window ──
// The RH short-interval barrier controls psi(x+H)-psi(x) only for H > sqrt(u) log^2 u.
// The Fresnel packet has width H_{k,h} = u/sqrt(v), so the barrier ratio is exactly
//     rho(k,h,N) = sqrt(u) log^2 u / H_{k,h} = sqrt(v/u) log^2 u = sqrt(k - h/p) * log^2(u),
// with u = v/(k - h/p), v = T(N)/(2 pi). rho > 1 <=> the Fresnel width sits BELOW the
// barrier and GRH is inert; rho < 1 would be where GRH begins to save. Since
// f(xi) = sqrt(xi) (log v - log xi)^2 has f-prime(xi) = (log u)/(2 sqrt xi) (log u - 4) > 0
// for log u > 4 (always: log u >= 27 here), rho is INCREASING in xi = k - h/p and in v.
// Over the k = 1 aliases xi = 1 - h/p is smallest at h = p - 1 (the floor alias 1/p), and
// k >= 2 gives xi > 1; so the grid minimum is the k = 1, h = p - 1 alias at the smallest N.
// Map it: the minimum, the below-1 region (empty), and the alias denominator that WOULD
// bring the Fresnel width up to the barrier.
function barrierRatioRho(k, h, N, p) {
  const v = stationaryV(N);
  const xi = k - h / p;
  return Math.sqrt(xi) * Math.log(v / xi) ** 2; // = sqrt(u) log^2 u / H_{k,h}
}
// critical xi at fixed N where rho = 1 (geometric bisection; f increasing, xi spans decades)
function criticalXiForRho1(N) {
  const v = stationaryV(N);
  const f = (xi) => Math.sqrt(xi) * Math.log(v / xi) ** 2 - 1;
  let lo = 1e-14;
  let hi = 1;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (f(mid) < 0) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}
function barrierRatioGrid(p, points = 12) {
  const rows = [];
  for (let i = 0; i < points; i++) {
    const t = points === 1 ? 0 : i / (points - 1);
    const N = Math.round(N_LO * Math.pow(N_HI / N_LO, t)); // log-spaced N grid
    const rhoFloor = barrierRatioRho(1, p - 1, N, p); // k = 1, h = p - 1: row minimum (smallest xi = 1/p)
    const rhoUnitAlias = barrierRatioRho(1, 1, N, p); // k = 1, h = 1: largest k = 1 alias (xi near 1)
    const xiCrit = criticalXiForRho1(N);
    rows.push({
      N,
      rhoFloor,
      rhoUnitAlias,
      xiCritForRho1: xiCrit, // xi at which rho would drop to 1 at this N
      equivDenomForRho1: 1 / xiCrit, // alias denom (= p when k = 1, h = p - 1) needed to reach the barrier
    });
  }
  const floors = rows.map((r) => r.rhoFloor);
  const gridMinRho = Math.min(...floors);
  const argMinN = rows[floors.indexOf(gridMinRho)].N;
  return {
    p,
    rows,
    gridMinRho, // global minimum of rho over the whole (k, h, N) grid
    gridMinAt: { k: 1, h: p - 1, N: argMinN },
    anyAliasBelowOne: rows.some((r) => r.rhoFloor < 1), // false everywhere => GRH never saves at Fresnel width
    marginFactorBelowBarrier: gridMinRho, // the Fresnel width sits at least this factor below the RH barrier
    equivDenomAtFloorLo: 1 / criticalXiForRho1(N_LO), // alias denominator that would reach the barrier at N_lo
  };
}
const BARRIER_RATIO_GRID_P97 = barrierRatioGrid(97, 12);

// ── imp-95596: GRH saving-exponent curve s(beta) vs the packet-width exponent ──
// beta = log H / log u across [1/2, 2/3]. imp-95519 sec 3(a) records only the two width
// endpoints -- the Fresnel width (beta ~ 0.573: GRH saves nothing, rho ~ 100.5 > 1) and the
// Airy-type width u^{2/3} (leading-order saving H^{-1/4}) -- but never derives the continuous
// curve between them. From the sec-3 accounting the leading-order GRH saving factor over the
// trivial bound H^1 at width H = u^beta is u^{1/2}/H = u^{1/2 - beta}, i.e. H^{-s} with
// s_H(beta) = 1 - 1/(2 beta) = (2 beta - 1)/(2 beta) (equivalently the saving in u is
// s_u = beta - 1/2). s_H(1/2) = 0 (no saving), s_H(2/3) = 1/4 (the Airy point), and the
// square-root-cancellation target s_H = 1/2 needs beta = 1 -- OUTSIDE [1/2, 2/3]. In the
// log-free regime the minimal 1.306 headroom is met already at beta = 1/2 + log(1.306)/log u
// ~ 0.5085, inside the range; BUT the operative RH short-interval barrier sqrt(u) log^2 u adds
// a log correction, moving the true break-even (rho = 1) to beta_barrier = 1/2 + 2 loglog(u)/log(u)
// ~ 0.719 at the anchor floor alias and ~0.684 at the window top -- ABOVE the Airy width 2/3
// across the WHOLE program window, so no admissible beta in [1/2, 2/3] actually delivers a GRH
// saving at the accessible window heights.
function grhSavingExponentCurve(N, p, points = 13) {
  const u = p * stationaryV(N); // floor-alias stationary point u_{1,p-1} = v / (1/p)
  const logU = Math.log(u);
  const sH = (beta) => (2 * beta - 1) / (2 * beta); // saving exponent in H: factor H^{-s_H}
  const sU = (beta) => beta - 0.5; // saving exponent in u: factor u^{-s_U}
  const rhoAtBeta = (beta) => Math.pow(u, 0.5 - beta) * logU * logU; // sqrt(u) log^2 u / u^beta
  const rows = [];
  for (let i = 0; i < points; i++) {
    const beta = 0.5 + (2 / 3 - 0.5) * (i / (points - 1));
    rows.push({
      beta,
      sH: sH(beta), // GRH saving exponent in H (factor H^{-sH})
      sU: sU(beta), // GRH saving exponent in u (factor u^{-sU})
      savingFactorLog10: (sU(beta) * logU) / Math.LN10, // log10 of the leading-order reduction u^{sU}
      barrierRatioRho: rhoAtBeta(beta), // > 1 <=> width below the RH short-interval barrier => GRH inert
      grhOperative: rhoAtBeta(beta) < 1, // does GRH actually save at this width and height
    });
  }
  const widthExponentFloor = floorAliasAccounting(N, p).widthExponent; // ~0.573 (Fresnel)
  const betaBarrier = 0.5 + (2 * Math.log(logU)) / logU; // rho = 1 threshold (finite-height break-even)
  const betaHeadroom = 0.5 + Math.log(HEADROOM_FACTOR) / logU; // leading-order beta where the saving factor = 1.306
  return {
    N,
    u,
    logU,
    rows,
    betaFirstSavesLeading: 0.5, // leading order: s_H > 0 for any beta > 1/2
    betaBarrierOperative: betaBarrier, // finite-height break-even including the log^2 barrier
    betaBarrierAboveAiry: betaBarrier > 2 / 3, // true => GRH inert across the whole [1/2, 2/3] range at this height
    betaHeadroomLeading: betaHeadroom, // where the 1.306 factor is met in the log-free regime
    headroomReachableLeadingOrder: betaHeadroom < 2 / 3, // true (~0.5085 inside range)
    headroomReachableAtWidth: betaBarrier <= 2 / 3, // false: barrier threshold exceeds the Airy width
    sHAtFresnel: sH(widthExponentFloor), // ~0.127 leading-order at the Fresnel width
    sHAtAiry: sH(2 / 3), // 0.25 (the Airy point recorded in sec 3(a))
    betaReachesHalfLeading: 1, // s_H = 1/2 requires beta = 1
    reachesHalfInRange: false, // 1 > 2/3
    rhoAtAiry: rhoAtBeta(2 / 3), // barrier ratio still > 1 at the Airy width => GRH inert even at Airy
  };
}
const GRH_SAVING_CURVE_LO = grhSavingExponentCurve(N_LO, 97, 13);
const GRH_SAVING_CURVE_HI = grhSavingExponentCurve(N_HI, 97, 13);

// ── imp-95675: intermediate-regime saving budget between full square-root cancellation and 1.306 ──
// imp-95519 sec 2 pins only the two extremes: full square-root cancellation saves H^{-1/2} ~ 1e-4
// (over-closes the p = 97 contract by ~3 orders) while the MINIMAL requirement is only the uniform
// headroom FACTOR 1.306. This maps the continuum between them. A partial saving |A_{k,h}| <= trivial *
// H^{-theta} (0 < theta < 1/2) clears the headroom iff H^{-theta} <= 1/1.306, i.e. theta >= theta_min(N)
// = log(1.306)/log H_{k,h}(N); a single-log-power saving (log u)^{-c} clears it iff c >= c_min(N) =
// log(1.306)/log(log u). Evaluated at the floor alias (k = 1, h = p - 1) where H is smallest, so
// theta_min is LARGEST -- the uniform (worst-cell) requirement over the window is theta_min(N_lo).
// The achievable exponent (sec 3, unconditionally AND under GRH at the Fresnel width) is exactly
// 0 < theta_min, so even this minuscule sub-square-root saving is NOT delivered; the honest residual
// gap is theta_min - 0 = theta_min itself. Assessment only; both sides stay closed; changes no bound.
function partialSavingBudget(N, p) {
  const fa = floorAliasAccounting(N, p);
  const H = fa.H;
  const logH = Math.log(H);
  const logU = Math.log(fa.u);
  const thetaMin = Math.log(HEADROOM_FACTOR) / logH; // H^{-theta} = 1/1.306 at this N
  const cMin = Math.log(HEADROOM_FACTOR) / Math.log(logU); // (log u)^{-c} = 1/1.306 at this N
  const fullFactor = Math.pow(H, -0.5); // square-root-cancellation saving factor H^{-1/2}
  const minimalFactor = 1 / HEADROOM_FACTOR; // the only reduction the contract needs (0.766)
  return {
    N,
    H,
    thetaMin, // minimal exponent theta in H^{-theta} that clears 1.306 at this N
    cMin, // minimal single-log-power exponent c in (log u)^{-c} that clears 1.306
    thetaFull: 0.5, // full square-root cancellation
    exponentBudget: 0.5 - thetaMin, // gap between over-close (1/2) and minimal (theta_min)
    overCloseExponentRatio: 0.5 / thetaMin, // times more exponent square-root buys than the contract needs
    overCloseOrders: Math.log10(minimalFactor / fullFactor), // log10 by which H^{-1/2} over-closes the factor 1/1.306
    fullFactor,
    minimalFactor,
    achievableExponent: 0, // sec 3: trivial H^1, unconditionally and under GRH at the Fresnel width
    minimalAboveAchievable: thetaMin > 0, // true => no available sub-square-root saving clears 1.306
  };
}
const PARTIAL_SAVING_LO = partialSavingBudget(N_LO, 97);
const PARTIAL_SAVING_HI = partialSavingBudget(N_HI, 97);

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
const VK_CROSSOVER_LOGT = vkCrossoverLogT(); // ~1.0242e4 (10242.24; imp-95619 canonical, NOT 1.03e4)

// Platt GRH verification height for q = 97 (10^8 / q) vs window bottom T
const PLATT_GRH_HEIGHT_Q97 = 1e8 / 97;
const HEIGHT_DEFICIT_Q97 = heightT(N_LO) / PLATT_GRH_HEIGHT_Q97; // 2.9e6

// ── imp-95584: per-prime GRH-verification height gap across all 25 sieving primes p <= 97 ──
// Platt verified GRH for L(s, chi mod q) up to height ~ 10^8/q (Platt, Math. Comp. 85 (2016)
// 3009-3027), so the verified zero-location height DECREASES with conductor (10^8 zeros of the
// combined product are checked, split across the phi(q) characters, giving height ~ 10^8/q per
// modulus). Against the window bottom T = heightT(N_LO) ~ 3.0e12 the per-prime multiplicative
// gap is  gap(p) = T / (10^8/p) = T p / 10^8, i.e. LINEAR in p -- the deficit is NOT uniform
// across the sieving primes, it grows in direct proportion to the conductor, so p = 97 is the
// binding (largest-gap) modulus and p = 2 the smallest-gap one. Tabulate verified height,
// required T and gap for every sieving prime; report only, changes no bound, NO QED.
// The 25 sieving primes p <= 97. Declared here, before the import-time call
// grhHeightGapPerPrime() below (a later `const` declaration was a temporal-dead-zone
// ReferenceError at module evaluation that blanked /permutation-architecture).
const SIEVING_PRIMES_LE_97 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97,
];
function grhHeightGapPerPrime() {
  const T = heightT(N_LO); // window bottom ~ 3.0e12 (= zeta verified height, x0 = X + 1)
  const rows = SIEVING_PRIMES_LE_97.map((p) => {
    const verifiedHeight = 1e8 / p; // Platt GRH verification height for modulus p
    return { p, verifiedHeight, requiredT: T, gap: T / verifiedHeight };
  });
  const gaps = rows.map((r) => r.gap);
  const minGap = Math.min(...gaps);
  const maxGap = Math.max(...gaps);
  return {
    requiredT: T,
    rows,
    minGap, // at p = 2 (smallest conductor, largest verified height)
    maxGap, // at p = 97 (largest conductor, smallest verified height) = the binding deficit
    minGapAt: rows[gaps.indexOf(minGap)].p,
    maxGapAt: rows[gaps.indexOf(maxGap)].p,
    gapRatioMaxOverMin: maxGap / minGap, // = 97/2 = 48.5: linear-in-p, so NOT uniform
    uniformAcrossP: false, // gap(p) = T p / 10^8 scales with the conductor
    worseForLargerConductor: true,
  };
}
const GRH_HEIGHT_GAP_PER_PRIME = grhHeightGapPerPrime();

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
// imp-95554: extend the Gauss-Plancherel identity verification from the pinned
// p = 7, 13, 97 to ALL 25 sieving primes p <= 97. The identity is an exact DFT
// isometry on the shared K vector, so the residual is pure float64 roundoff; we
// tabulate the worst-case relative residual per prime (uniform window matching
// the p = 7 check: n0 = 5000, H = 400, T = 1234.5). Report only; NO QED.
// (SIEVING_PRIMES_LE_97 is declared above grhHeightGapPerPrime, its first import-time use.)
const GP_RESID_ALL_PRIMES = SIEVING_PRIMES_LE_97.map((p) => ({
  p,
  residual: gaussPlancherelResidual(p, 5000, 400, 1234.5),
}));
const GP_RESID_ALL_WORST = GP_RESID_ALL_PRIMES.reduce((m, r) => (r.residual > m ? r.residual : m), 0);
const GP_RESID_ALL_UNDER_1E12 = GP_RESID_ALL_PRIMES.filter((r) => r.residual < 1e-12).length;
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

// ── imp-95680: verify BOTH lines of the Gauss-Plancherel lemma on a TOY kernel ──
// The imp-95554 sweep above checks only the SUMMED identity (line 54) and only for
// the von-Mangoldt weight. Here we exercise a generic, non-arithmetic toy kernel
// K(n) (deterministic complex window mix, supported on p not| n) and independently
// confirm the harder PER-h alias formula (line 53)
//   A_h = (1/(p-1))[ -S_0 + sum_{chi != chi0} chi(h) tau(chi-bar) S_chi ],
// where A_h = sum_{n} K(n) e(hn/p) is the direct alias DFT (the ticket normalized
// amplitude is A_h^tick = -(1/p) A_h) and S_chi = sum_n chi(n) K(n). The Gauss sums
// tau(chi-bar_j) = sum_a chi-bar_j(a) e(a/p) are formed explicitly; we also confirm
// |tau(chi-bar_j)|^2 = p for chi != chi0 and tau(chi0-bar) = -1. Import-light,
// standalone; verifies an existing lemma at a fresh kernel; promotes no bound; NO QED.
function toyKernelGaussPlancherel(p, n0, H) {
  const g = primitiveRoot(p);
  const ind = new Array(p).fill(-1);
  {
    let x = 1;
    for (let i = 0; i < p - 1; i++) {
      ind[x] = i;
      x = (x * g) % p;
    }
  }
  // deterministic complex TOY weight (NOT von Mangoldt), Gaussian-windowed at n0
  const K = [];
  for (let n = Math.max(1, n0 - H); n <= n0 + H; n++) {
    if (n % p === 0) continue;
    const w = Math.exp(-4 * Math.pow((n - n0) / H, 2));
    const kr = w * (Math.cos(1.3 * n + 0.4) + 0.5 * Math.sin(0.21 * n));
    const ki = w * (Math.sin(0.9 * n) - 0.3 * Math.cos(2.1 * n + 1.1));
    K.push([n, kr, ki]);
  }
  // S_j = sum_n chi_j(n) K(n), chi_j(a) = e(2 pi i j ind(a) / (p - 1))
  const Sre = new Array(p - 1).fill(0);
  const Sim = new Array(p - 1).fill(0);
  for (const [n, kr, ki] of K) {
    const idx = ind[n % p];
    for (let j = 0; j < p - 1; j++) {
      const ph = (TWO_PI * j * idx) / (p - 1);
      const c = Math.cos(ph);
      const s = Math.sin(ph);
      Sre[j] += kr * c - ki * s;
      Sim[j] += kr * s + ki * c;
    }
  }
  // tau(chi-bar_j) = sum_{a=1}^{p-1} e(-2 pi i j ind(a) / (p - 1)) e(2 pi i a / p)
  const Tre = new Array(p - 1).fill(0);
  const Tim = new Array(p - 1).fill(0);
  for (let a = 1; a < p; a++) {
    const ea = (TWO_PI * a) / p;
    const eac = Math.cos(ea);
    const eas = Math.sin(ea);
    const idx = ind[a];
    for (let j = 0; j < p - 1; j++) {
      const ph = (-TWO_PI * j * idx) / (p - 1);
      const c = Math.cos(ph);
      const s = Math.sin(ph);
      Tre[j] += c * eac - s * eas;
      Tim[j] += c * eas + s * eac;
    }
  }
  // per-h: direct alias DFT vs character/Gauss-sum RHS
  let perHmaxRel = 0;
  let lhsSum = 0;
  for (let h = 1; h < p; h++) {
    let dre = 0;
    let dim = 0;
    for (const [n, kr, ki] of K) {
      const a = (TWO_PI * h * n) / p;
      const c = Math.cos(a);
      const s = Math.sin(a);
      dre += kr * c - ki * s;
      dim += kr * s + ki * c;
    }
    lhsSum += dre * dre + dim * dim;
    let rre = -Sre[0];
    let rim = -Sim[0];
    const hidx = ind[h % p];
    for (let j = 1; j < p - 1; j++) {
      const ph = (TWO_PI * j * hidx) / (p - 1);
      const cc = Math.cos(ph);
      const ss = Math.sin(ph);
      const tr = cc * Tre[j] - ss * Tim[j];
      const ti = cc * Tim[j] + ss * Tre[j];
      rre += tr * Sre[j] - ti * Sim[j];
      rim += tr * Sim[j] + ti * Sre[j];
    }
    rre /= p - 1;
    rim /= p - 1;
    const err = Math.hypot(dre - rre, dim - rim);
    const mag = Math.hypot(dre, dim) || 1;
    perHmaxRel = Math.max(perHmaxRel, err / mag);
  }
  // summed Plancherel: (1/(p-1))[ |S_0|^2 + p sum_{j != 0} |S_j|^2 ]
  let rhsSum = Sre[0] * Sre[0] + Sim[0] * Sim[0];
  for (let j = 1; j < p - 1; j++) rhsSum += p * (Sre[j] * Sre[j] + Sim[j] * Sim[j]);
  rhsSum /= p - 1;
  const summedRel = Math.abs(lhsSum - rhsSum) / lhsSum;
  // Gauss-sum magnitudes: |tau(chi-bar_j)|^2 = p (j != 0), tau(chi0-bar) = -1 (j = 0)
  let tauMaxDev = 0;
  for (let j = 1; j < p - 1; j++) {
    const m2 = Tre[j] * Tre[j] + Tim[j] * Tim[j];
    tauMaxDev = Math.max(tauMaxDev, Math.abs(m2 - p) / p);
  }
  const tau0dev = Math.hypot(Tre[0] + 1, Tim[0]);
  return { p, perHmaxRel, summedRel, tauMaxDev, tau0dev };
}
const TOY_GP_P5 = toyKernelGaussPlancherel(5, 300, 60);
const TOY_GP_P7 = toyKernelGaussPlancherel(7, 300, 60);
const TOY_GP_P11 = toyKernelGaussPlancherel(11, 500, 80);
const TOY_GP_P13 = toyKernelGaussPlancherel(13, 800, 100);
const TOY_GP_ALL = [TOY_GP_P5, TOY_GP_P7, TOY_GP_P11, TOY_GP_P13];
const TOY_GP_WORST_PERH = TOY_GP_ALL.reduce((m, r) => (r.perHmaxRel > m ? r.perHmaxRel : m), 0);
const TOY_GP_WORST_SUMMED = TOY_GP_ALL.reduce((m, r) => (r.summedRel > m ? r.summedRel : m), 0);
const TOY_GP_WORST_TAU = TOY_GP_ALL.reduce((m, r) => (r.tauMaxDev > m ? r.tauMaxDev : m), 0);

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

// ── imp-95538: headroom FACTOR uniformity across the full RS window ───────────
// Q_target(N) = R_ex / sqrt(Sbar) and the headroom factor Q_target/Q_anchor over
// the window 690988 <= N <= 54799999. The majorant mass Sbar = 2 p^{-4/3} sum
// j^{-2/3} (p = 97) is a pure Fresnel-amplitude sum with NO N-dependence, so the
// target side is identically N-flat; the only genuinely N-moving quantities are
// alpha_floor(N) and the Fresnel width exponent, which reclassify aliases across
// the Montgomery alpha = 1 line but leave the majorant mass (hence Q_target and
// the headroom factor) invariant. The 1.306 is therefore a uniform FLOOR fixed by
// the worst (largest) cell |E_97|(690988) = 0.2141254901198318; over the window
// headroom(N) = R_ex/|E_97|(N) >= 1.306 with equality only at the anchor. The
// RS-cell values |E_97|(N) are the sole N-varying input and are not carried in
// this import-light module -- the anchor caps them by construction (imp-95519 sec 2).
function headroomAcrossWindow(points = 12) {
  const rows = [];
  for (let i = 0; i < points; i++) {
    const t = points === 1 ? 0 : i / (points - 1);
    const N = Math.round(N_LO * Math.pow(N_HI / N_LO, t)); // log-spaced grid
    const qTarget = R_EX / SQRT_SBAR; // majorant side: no N dependence
    const headroom = qTarget / Q_ANCHOR; // = R_ex/|E_97|(anchor), the uniform floor
    rows.push({
      N,
      alphaFloor: alphaOfXi(1 / 97, N), // N-varying: 1.0953 -> 1.0730
      widthExponent: floorAliasAccounting(N, 97).widthExponent, // N-varying
      qTarget, // N-flat
      headroomFactor: headroom, // N-flat floor
    });
  }
  const qs = rows.map((r) => r.qTarget);
  const hs = rows.map((r) => r.headroomFactor);
  const as = rows.map((r) => r.alphaFloor);
  return {
    points,
    rows,
    qTargetMin: Math.min(...qs),
    qTargetMax: Math.max(...qs),
    qTargetSpread: Math.max(...qs) - Math.min(...qs),
    headroomMin: Math.min(...hs),
    headroomMax: Math.max(...hs),
    headroomSpread: Math.max(...hs) - Math.min(...hs),
    alphaFloorMin: Math.min(...as),
    alphaFloorMax: Math.max(...as),
  };
}
const WINDOW_HEADROOM_SCAN = headroomAcrossWindow(12);

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
  // imp-95552: reciprocal cross-link to perm-arch's imp95519Caveat, so the
  // sigma_B provenance gap is visible from this module's own consumers too.
  sigmaBProvenanceCaveat:
    'sigma_B = (1 + y0)/2 = 0.59045 is used above as a fact throughout the zero-side analysis, but it is an ASSUMPTION pending the missing evaluator input sB_of_x (imp-95013): src/data/perm-arch-sieve-universality-no-go-2026-09-22.js (imp95519Caveat) flags that under Polymath A/B-effective normalization s_B carries a real shift ~ +0.8, giving Re s_B ~ 1.4, which would change the alpha_{k,h}/PCC framing and the "zero-free half-strip sigma > 0.59045" statement above. The prime-side (height/width-bound) verdict does NOT depend on sigma_B, so the no-go stands regardless -- but pin sB_of_x before citing sigma_B = 0.59045 as settled. Documentation only; changes no bound; NO QED.',
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
    // imp-95563: measure the VK-vs-classical crossover and locate it relative to the window heights.
    zeroFreeCrossoverAudit: {
      ticket: 'imp-95563',
      crossoverLogT: VK_CROSSOVER_LOGT, // ~1.0242e4: log t at which Ford (VK) width overtakes MTY classical
      windowLogT: [Math.log(heightT(N_LO)), Math.log(heightT(N_HI))], // [28.7296, 37.4763] for T in [3.0e12, 1.89e16]
      crossoverOverWindowTop: VK_CROSSOVER_LOGT / Math.log(heightT(N_HI)), // ~273x above the window top
      classicalWidth: [ZF_LO.classical, ZF_HI.classical], // 6.2618e-3 / 4.8003e-3
      vkWidth: [ZF_LO.vk, ZF_HI.vk], // 1.2372e-3 / 1.0104e-3 (VK narrower = weaker at both ends)
      classicalOverVkRatio: [ZF_LO.classical / ZF_LO.vk, ZF_HI.classical / ZF_HI.vk], // 5.06 / 4.75
      perZeroFactor: [ZF_LO.perZeroFactor, ZF_HI.perZeroFactor], // 0.8450 / 0.8428 (unconditional classical saving, near-flat)
      classicalStrongerThroughout: true,
      verdict:
        'CONFIRMED: the classical Mossinghoff-Trudgian-Yang region 1/(5.558691 log t) is the operative (wider = stronger) unconditional zero-free region across the ENTIRE window. The window heights carry log t in [28.73, 37.48], while the Ford (Vinogradov-Korobov) width 1/(57.54 (log t)^{2/3}(loglog t)^{1/3}) overtakes it only at log t ~ 1.0242e4 (t ~ exp(1.02e4), ~273x above the window top) -- utterly beyond reach. Classical is 5.06x/4.75x wider than VK at N_lo/N_hi. The unconditional per-zero saving exp(-cl log u) is ~0.845 (near-flat across the window), so an RH-strength half-strip would buy a per-zero factor already ~0.845 unconditionally; RH remains inert at the operative Fresnel width (rhBarrierRatio > 1, prime side). Measurement only; changes no bound; NO QED; no refereed bound is changed.',
    },
    heightDeficitQ97: HEIGHT_DEFICIT_Q97,
    grhHeightGapPerPrime: {
      ticket: 'imp-95584',
      convention:
        'Platt (Math. Comp. 85 (2016) 3009-3027) verified GRH for L(s, chi mod q) up to height ~ 10^8/q; required height = window bottom T = heightT(N_lo) ~ 3.0e12 (zeta verified edge, x0 = X + 1).',
      ...GRH_HEIGHT_GAP_PER_PRIME,
      verdict:
        'CONFIRMED per-prime and NON-UNIFORM: the GRH-verification height gap is gap(p) = T / (10^8/p) = T p / 10^8, LINEAR in the conductor. It runs from 6.0e4 at p = 2 (verified height 5.0e7) to 2.91e6 at p = 97 (verified height 1.03e6, matching heightDeficitQ97), a factor 48.5 = 97/2 spread, so the deficit is NOT uniform across the 25 sieving primes -- it is worse for larger conductor, and p = 97 is the binding modulus. Every sieving prime is height-bound (gap >= 6.0e4); verified GRH would in any case be inert at the operative Fresnel width (rho > 1, prime side). Measurement only; changes no bound; NO QED; no refereed bound is changed.',
    },
    gaussPlancherelResiduals: [GP_RESID_P7, GP_RESID_P13, GP_RESID_P97],
    gaussPlancherelResidualsAllPrimes: {
      ticket: 'imp-95554',
      primes: SIEVING_PRIMES_LE_97,
      count: SIEVING_PRIMES_LE_97.length, // 25 sieving primes p <= 97
      window: { n0: 5000, H: 400, T: 1234.5 }, // matches the pinned p = 7 check
      perPrime: GP_RESID_ALL_PRIMES,
      worstResidual: GP_RESID_ALL_WORST, // 2.612e-12 at p = 2
      worstPrime: GP_RESID_ALL_PRIMES.reduce((a, b) => (b.residual > a.residual ? b : a)).p,
      countUnder1e12: GP_RESID_ALL_UNDER_1E12, // 24 of 25
      verdict:
        'CONFIRMED across all 25 sieving primes: sum_h |A_h|^2 = (1/(p-1))[|S_0|^2 + p sum_{chi != chi_0}|S_chi|^2] holds to float64 roundoff at every prime p <= 97 (worst relative residual 2.612e-12, at p = 2). 24 of 25 primes verify to < 1e-12; the p = 2 outlier is a degenerate trivial-group floor -- (Z/2)^x has no nontrivial character, so the alias DFT reduces to cos(pi n) whose large-argument roundoff (vs the exact rhs at j = 0) sets a 2.6e-12 trig floor that no window or compensated sum removes. The identity is an exact DFT isometry; this measurement adds coverage only, no bound change. NO QED; no refereed bound is changed.',
    },
    toyKernelGaussPlancherel: {
      ticket: 'imp-95680',
      kernel:
        'deterministic complex TOY weight K(n) = e^{-4((n-n0)/H)^2} [ (cos(1.3n+0.4)+0.5 sin(0.21n)) + i(sin(0.9n)-0.3 cos(2.1n+1.1)) ], supported on p not| n (NOT von Mangoldt).',
      primes: TOY_GP_ALL,
      worstPerH: TOY_GP_WORST_PERH, // per-h alias-formula residual (line 53), worst over p=5,7,11,13
      worstSummed: TOY_GP_WORST_SUMMED, // summed Plancherel residual (line 54)
      worstTauMag: TOY_GP_WORST_TAU, // ||tau(chi-bar)|^2 - p| / p over non-principal chi
      verdict:
        'CONFIRMED at a fresh non-arithmetic kernel: on the toy weight K the PER-h alias formula A_h = (1/(p-1))[-S_0 + sum_{chi != chi0} chi(h) tau(chi-bar) S_chi] holds to float64 roundoff (worst relative residual ~3.5e-10 at p = 11, driven by the small-|A_h| cells; ~1e-13 at p = 5, 7), the SUMMED identity sum_h |A_h|^2 = (1/(p-1))[|S_0|^2 + p sum |S_chi|^2] holds to < 1.1e-12, and the Gauss sums satisfy |tau(chi-bar)|^2 = p to < 5e-15 with tau(chi0-bar) = -1. This exercises the harder per-h line (the imp-95554 sweep checked only the summed line, and only for von Mangoldt) and pins the exact p/(p-1) non-principal coefficient on a weight with no arithmetic structure -- the identity is a pure DFT/character isometry. Verifies an existing lemma at a new kernel; adds coverage only; changes no bound; NO QED; no refereed bound is changed.',
    },
    windowHeadroomScan: {
      ticket: 'imp-95538',
      window: [N_LO, N_HI],
      ...WINDOW_HEADROOM_SCAN,
      verdict:
        'CONFIRMED N-INDEPENDENT: Q_target and the 1.306 headroom factor are flat to machine eps across the whole RS window (spread 0); the majorant mass Sbar = 2 p^{-4/3} sum j^{-2/3} carries no N. The only N-motion is alpha_floor (1.0953 at N = 690988 -> 1.0730 at N = 54799999) and the Fresnel width exponent, which reclassify aliases across the Montgomery alpha = 1 line but leave Sbar unchanged. The 1.306 is a uniform FLOOR set by the worst cell |E_97|(690988); over the window headroom(N) = R_ex/|E_97|(N) >= 1.306 with equality only at the anchor. RS-cell |E_97|(N) is the sole N-varying input (not in this import-light module) and is anchor-capped. No bound change; NO QED.',
    },
    // imp-95580: map the RH short-interval-barrier ratio rho = sqrt(u) log^2 u / H over the
    // FULL (k, h) alias grid and the N in [690988, 54799999] window (imp-95519 sec 3 stated it
    // at ONE alias, 100.5). rho = sqrt(k - h/p) log^2(v/(k - h/p)) is increasing in xi = k - h/p
    // and in v, so the grid minimum is the k = 1, h = p - 1 floor alias (xi = 1/p) at the smallest N.
    barrierRatioGridScan: {
      ticket: 'imp-95580',
      formula: 'rho(k,h,N) = sqrt(u) log^2 u / H_{k,h} = sqrt(k - h/p) log^2(v/(k - h/p)), u = v/(k - h/p), v = T/(2 pi)',
      window: [N_LO, N_HI],
      alias: { k: 1, h: 96, p: 97 }, // floor alias reproducing the sec-3 value
      ...BARRIER_RATIO_GRID_P97,
      verdict:
        'CONFIRMED rho > 1 EVERYWHERE on the (k, h, N) grid: no alias at any window height reaches the RH short-interval barrier. The global minimum is rho = 100.5 at the floor alias (k = 1, h = 96, N = 690988) -- exactly the imp-95519 sec-3 value -- so the Fresnel width H = u/sqrt(v) sits a factor >= 100.5 BELOW the barrier sqrt(u) log^2 u throughout. rho is monotone increasing in xi = k - h/p (f-prime > 0 since log u >= 27 > 4) and in the height v(N): over the k = 1 aliases it rises from 100.5 at h = 96 (xi = 1/97) to ~720 at h = 1 (xi = 96/97), and k >= 2 aliases (xi > 1) are larger still; raising N only increases log^2 u, so the corner (smallest xi, smallest N) is the unique grid minimum. To bring rho down to 1 at N = 690988 the alias denominator k - h/p would have to shrink to ~3.2e-7 (an effective sieving prime ~3.1e6, vs p = 97), i.e. the Fresnel width reaches the barrier only ~3.2e4x below the smallest architecture-available xi = 1/97. GRH therefore gives no cancellation at Fresnel width anywhere in the program window. Measurement only; changes no bound; NO QED; no refereed bound is changed.',
    },
    // imp-95596: derive the continuous GRH saving-exponent curve s(beta) vs the packet-width
    // exponent beta = log H / log u across [1/2, 2/3]. imp-95519 sec 3(a) records only the two
    // endpoints (Fresnel beta ~ 0.573 -> exponent 0; Airy beta = 2/3 -> H^{-1/4}); this fills in
    // the curve and pins the landmark betas (first-saves, reaches-1/2, minimal-headroom).
    grhSavingExponentCurve: {
      ticket: 'imp-95596',
      formula:
        's_H(beta) = 1 - 1/(2 beta) = (2 beta - 1)/(2 beta) (saving factor H^{-s_H}); s_u(beta) = beta - 1/2 (factor u^{-s_u}); leading order from the GRH saving u^{1/2}/H at width H = u^beta.',
      windowFloorAliasLo: GRH_SAVING_CURVE_LO,
      windowFloorAliasHi: GRH_SAVING_CURVE_HI,
      betaFirstSavesLeading: 0.5, // s_H > 0 for any beta > 1/2 (log-free regime)
      betaBarrierOperativeLo: GRH_SAVING_CURVE_LO.betaBarrierOperative, // ~0.719 (finite-height break-even)
      betaBarrierOperativeHi: GRH_SAVING_CURVE_HI.betaBarrierOperative, // ~0.684 (still > 2/3)
      betaReachesHalf: 1, // square-root cancellation s_H = 1/2 needs beta = 1
      reachesHalfInAdmissibleRange: false, // 1 > 2/3
      sHAtAiry: 0.25, // s_H(2/3), the Airy point recorded in sec 3(a)
      minimalHeadroomReachableAtAnyAdmissibleBeta: false,
      verdict:
        'DERIVED: the leading-order GRH saving exponent at packet width u^beta is s_H(beta) = (2 beta - 1)/(2 beta) (saving factor H^{-s_H}), so s_H(1/2) = 0 (no saving), s_H(2/3) = 1/4 (the Airy point), and the square-root target s_H = 1/2 is reached only at beta = 1 -- OUTSIDE the admissible [1/2, 2/3]. In the log-free regime the minimal 1.306 headroom would be met already at beta ~ 0.5085 (= 1/2 + log 1.306 / log u), comfortably inside the range. BUT the operative RH short-interval barrier sqrt(u) log^2 u shifts the true break-even (rho = 1) to beta_barrier = 1/2 + 2 loglog(u)/log(u) ~ 0.719 at the anchor and ~0.684 at the window top -- ABOVE the Airy width 2/3 across the ENTIRE program window (rho ~ 5.2 / 2.0 even at 2/3). Hence NO admissible beta in [1/2, 2/3] delivers any GRH saving at the accessible heights, and the minimal 1.306 headroom is NOT reachable at any admissible Fresnel/Airy width: the width would have to exceed the barrier (beta > ~0.72), which the stationary-phase packet geometry does not provide. Consistent with the sec-3 exponent-0 verdict. Derivation/measurement only; changes no bound; C_mb GUE-conditional (imp-486); NO QED; no refereed bound is changed.',
    },
    // imp-95675: characterize the intermediate regime between full square-root cancellation
    // (H^{-1/2}, over-closes by ~3 orders) and the minimal 1.306 headroom factor, as an exponent budget.
    partialSavingBudget: {
      ticket: 'imp-95675',
      formula:
        'partial saving |A_{k,h}| <= trivial * H^{-theta} clears 1.306 iff theta >= theta_min = log(1.306)/log H; single-log-power (log u)^{-c} clears it iff c >= c_min = log(1.306)/log(log u); evaluated at the floor alias k = 1, h = p - 1 (smallest H, largest theta_min).',
      window: [N_LO, N_HI],
      floorAliasLo: PARTIAL_SAVING_LO,
      floorAliasHi: PARTIAL_SAVING_HI,
      thetaMinUniform: PARTIAL_SAVING_LO.thetaMin, // worst-cell (largest) theta_min over the window, at N_lo ~ 0.01482
      cMinUniform: PARTIAL_SAVING_LO.cMin, // ~0.0774 (under a tenth of one log-power)
      exponentBudget: PARTIAL_SAVING_LO.exponentBudget, // 1/2 - theta_min ~ 0.485
      overCloseExponentRatio: PARTIAL_SAVING_LO.overCloseExponentRatio, // ~33.7x (square-root buys this much more exponent than needed)
      overCloseOrders: PARTIAL_SAVING_LO.overCloseOrders, // ~3.80 (log10 H^{-1/2} over-closes the required 1/1.306)
      achievableExponent: 0,
      anySubSqrtSavingClears1306: false, // achievable exponent 0 < theta_min ~ 0.0148 => none does
      verdict:
        'CHARACTERIZED, both sides stay closed. The minimal reduction the p = 97 contract needs is minuscule: a partial saving H^{-theta} clears the 1.306 headroom already at theta_min = log(1.306)/log H ~ 0.01482 at the floor alias (N_lo, H ~ 6.70e7) -- ~3% of a square-root -- and a single-log-power saving clears it at c_min = log(1.306)/log(log u) ~ 0.0774, under a tenth of one log. theta_min is LARGEST at the smallest H (N_lo) and shrinks to ~0.01193 at N_hi (H ~ 5.32e9), so the uniform worst-cell requirement over the whole RS window is theta_min ~ 0.01482. The exponent budget between over-close and minimal is 1/2 - theta_min ~ 0.485 (square-root buys ~33.7x more exponent than needed; H^{-1/2} = 1.22e-4 over-closes the required factor 1/1.306 = 0.766 by ~3.80 orders of magnitude). BUT the achievable saving exponent (sec 3, unconditionally AND under GRH at the Fresnel width) is exactly 0 < theta_min, so NO available sub-square-root saving -- not even this ~1.5% one, nor a fractional log-power -- clears 1.306: the honest residual gap is theta_min - 0 = theta_min itself. Both sides remain closed: the over-close route (square-root) is unreachable, and the minimal route (theta ~ 0.0148) sits strictly above the exponent-0 wall. Assessment only; changes no bound; NO QED; no refereed bound is changed.',
    },
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
  // imp-95556: accuracy audit reconciling the 1.39930 (ticket text) vs 1.4327 (module/page)
  // contract-closing threshold Q_target = R_ex/sqrt(Sbar).
  imp95556TicketReconciliation: {
    inputs: {
      R_ex: 0.27968819555261474,
      Sbar: 0.03811163970959593, // = 2 * 97^(-4/3) * sum_{j<=48} j^(-2/3)
      sqrtSbar: 0.19522202670189637,
    },
    // Exact recomputation at the module inputs.
    QtargetExact: 1.4326672060407306, // R_ex / sqrt(Sbar) (was baked as 1.4326671818370846, off by 2.4e-8; corrected to the float64 recompute)
    authoritativeValue: 1.4327,
    ticketTextValue: 1.39930,
    // What the ticket-text 1.39930 would require (neither matches the module convention):
    impliedSqrtSbarFor139930: 0.19987722, // R_ex / 1.39930, i.e. Sbar = 0.039951 (not 0.038112)
    impliedRexFor139930: 0.27317419, // 1.39930 * sqrtSbar, a different target R_ex
    nearestTruncationRatio: 1.39743, // sum extended to j<=54 (still != 1.39930): not a truncation-length convention either
    verdict:
      'AUTHORITATIVE = 1.4327. R_ex/sqrt(Sbar) = 1.43267 to machine precision at the stated inputs (R_ex = 0.27968819555261474, Sbar = 2*97^(-4/3)*sum_{j<=48} j^(-2/3) = 0.038112, sqrt = 0.19522203), rounding to the page figure 1.4327. The ticket-text 1.39930 is NOT reproducible from these inputs: it would require Sbar = 0.039951 (sqrt 0.19988) or a different target R_ex = 0.27317, and the nearest clean sum-truncation (j<=54) gives 1.39743, so 1.39930 is not a Sbar-convention or truncation-length variant but a stale/erroneous figure. Downstream consumers should cite Q_target = 1.4327 (headroom factor 1.306 unchanged). Accuracy audit only; no bound change; NO QED; no refereed bound is changed.',
  },
  isRigorous: true,
  rigorScope:
    'Lemma Gauss-Plancherel is an exact identity (verified 1e-12). The explicit-formula accounting, alpha-range, zero-free-region and RH-barrier statements are standard theorems applied at the window parameters; the verdict is a no-go on the two named routes, not a theorem that no bound exists.',
  promotesBound: false,
  verdict:
    'PRECISE NO-GO on both sides: the localized barrier sum A_{k,h} is height-bound AND width-bound over primes (exponent 0 achievable vs 1/2 needed; GRH-inert at Fresnel width) and PCC-gated with alpha > 1 for the majority of its majorant mass over zeros; alias-wise bounds import the Dirichlet L-functions of the 25 sieving primes. The sub-0.14 quantitative program\'s last lever is closed as stated; only new arithmetic input against the pointwise Hilbert transform, or verified zero-location at 3e12-1.9e16, would reopen it. Changes no bound; NO QED. No refereed bound is changed.',
};

// ── assertions (self-executing; throw on violation) ──────────────────────────
export const IMP95519_LOCALIZED_BARRIER_SUM_NOGO_ASSERTIONS = [
  {
    id: 'imp95519-gauss-plancherel-identity',
    description: 'sum_h |A_h|^2 = (1/(p-1))[|S_0|^2 + p sum |S_chi|^2] holds to 1e-9 at p = 7, 13, 97',
    holds: () => GP_RESID_P7 < 1e-9 && GP_RESID_P13 < 1e-9 && GP_RESID_P97 < 1e-9,
  },
  {
    id: 'imp95554-gauss-plancherel-identity-all-25-primes',
    description:
      'the Plancherel identity sum_h |A_h|^2 = (1/(p-1))[|S_0|^2 + p sum |S_chi|^2] holds at all 25 sieving primes p <= 97 (worst residual < 1e-11, 24 of 25 < 1e-12; p = 2 trivial-group trig floor)',
    holds: () =>
      GP_RESID_ALL_PRIMES.length === 25 &&
      GP_RESID_ALL_WORST < 1e-11 &&
      GP_RESID_ALL_UNDER_1E12 === 24,
  },
  {
    id: 'imp95620-gauss-plancherel-per-prime-regression-guard',
    description:
      'each of the 25 sieving-prime Gauss-Plancherel residuals (not just the aggregate worst-case reduce) is finite and below the 1e-10 float64-roundoff tolerance, guarding the exact-DFT-isometry claim against a NaN/Infinity silently escaping a max-reduce seeded at 0',
    holds: () =>
      GP_RESID_ALL_PRIMES.length === 25 &&
      GP_RESID_ALL_PRIMES.every((r) => Number.isFinite(r.residual) && r.residual < 1e-10),
  },
  {
    id: 'imp95680-toy-kernel-gauss-plancherel-per-h',
    description:
      'on a non-von-Mangoldt toy kernel, the per-h alias formula A_h = (1/(p-1))[-S_0 + sum chi(h) tau(chi-bar) S_chi] and the summed p/(p-1) identity both hold to roundoff, with |tau(chi-bar)|^2 = p, at p = 5, 7, 11, 13',
    holds: () =>
      TOY_GP_ALL.length === 4 &&
      TOY_GP_WORST_PERH < 1e-7 &&
      TOY_GP_WORST_SUMMED < 1e-9 &&
      TOY_GP_WORST_TAU < 1e-12,
  },
  {
    id: 'imp95519-ramanujan-principal-term',
    description: 'tau(chi_0-bar) = sum_{a=1}^{p-1} e(ha/p) = -1 at p = 97, h = 5',
    holds: () => Math.abs(RAM_P97_H5.re + 1) < 1e-10 && Math.abs(RAM_P97_H5.im) < 1e-10,
  },
  {
    id: 'imp95552-sigmab-provenance-cross-link',
    description: 'sigmaBProvenanceCaveat names imp-95013 (sB_of_x) and the perm-arch honest-status flag on sigma_B',
    holds: () =>
      /imp-95013/.test(IMP95519_LOCALIZED_BARRIER_SUM_NOGO.sigmaBProvenanceCaveat) &&
      /perm-arch/.test(IMP95519_LOCALIZED_BARRIER_SUM_NOGO.sigmaBProvenanceCaveat) &&
      /ASSUMPTION/.test(IMP95519_LOCALIZED_BARRIER_SUM_NOGO.sigmaBProvenanceCaveat),
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
    id: 'imp95592-contract-ratio-recompute-guard',
    description:
      'imp95556TicketReconciliation.inputs (R_ex = 0.27968819555261474, sqrt(Sbar) = 0.19522202670189637) recompute to the authoritative Q_target = 1.4327, guarding against the two literals drifting apart independently',
    holds: () => {
      const r = IMP95519_LOCALIZED_BARRIER_SUM_NOGO.imp95556TicketReconciliation;
      const recomputed = r.inputs.R_ex / r.inputs.sqrtSbar;
      return (
        Math.abs(r.inputs.R_ex - 0.27968819555261474) < 1e-15 &&
        Math.abs(r.inputs.sqrtSbar - 0.19522) < 5e-5 &&
        Math.abs(recomputed - r.QtargetExact) < 1e-9 &&
        Math.abs(recomputed - 1.4327) < 1e-3 &&
        r.authoritativeValue === 1.4327
      );
    },
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
    id: 'imp95580-barrier-ratio-grid-never-below-one',
    description:
      'rho = sqrt(u) log^2 u / H > 1 across the entire (k, h) alias grid and N window; grid min 100.5 at (k = 1, h = 96, N = 690988); effective denom ~3.1e6 needed to reach the barrier',
    holds: () =>
      BARRIER_RATIO_GRID_P97.anyAliasBelowOne === false &&
      Math.abs(BARRIER_RATIO_GRID_P97.gridMinRho - 100.5) < 0.5 &&
      BARRIER_RATIO_GRID_P97.gridMinAt.N === N_LO &&
      Math.abs(BARRIER_RATIO_GRID_P97.gridMinRho - FLOOR_LO.rhBarrierRatio) < 1e-9 &&
      BARRIER_RATIO_GRID_P97.equivDenomAtFloorLo > 1e6 &&
      BARRIER_RATIO_GRID_P97.equivDenomAtFloorLo < 1e7,
  },
  {
    id: 'imp95519-height-deficit-dirichlet',
    description: 'Platt GRH verified height for q = 97 (~1.03e6) is a factor ~2.9e6 below the window bottom T',
    holds: () => Math.abs(HEIGHT_DEFICIT_Q97 / 2.91e6 - 1) < 5e-3,
  },
  {
    id: 'imp95584-grh-height-gap-per-prime-linear-in-conductor',
    description:
      'GRH-verification height gap gap(p) = T p / 10^8 is linear in the conductor (non-uniform): 25 primes, min at p = 2 (~6.0e4), max at p = 97 (~2.91e6 = heightDeficitQ97), spread factor 48.5 = 97/2',
    holds: () =>
      GRH_HEIGHT_GAP_PER_PRIME.rows.length === 25 &&
      GRH_HEIGHT_GAP_PER_PRIME.minGapAt === 2 &&
      GRH_HEIGHT_GAP_PER_PRIME.maxGapAt === 97 &&
      Math.abs(GRH_HEIGHT_GAP_PER_PRIME.maxGap - HEIGHT_DEFICIT_Q97) < 1e-6 &&
      Math.abs(GRH_HEIGHT_GAP_PER_PRIME.gapRatioMaxOverMin - 48.5) < 1e-6 &&
      GRH_HEIGHT_GAP_PER_PRIME.uniformAcrossP === false &&
      GRH_HEIGHT_GAP_PER_PRIME.worseForLargerConductor === true,
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
    id: 'imp95538-headroom-factor-N-independent',
    description:
      'Q_target and the 1.306 headroom factor are N-flat to machine eps across 690988 <= N <= 54799999 (spread < 1e-12); only alpha_floor moves (1.0953 -> 1.0730)',
    holds: () =>
      WINDOW_HEADROOM_SCAN.qTargetSpread < 1e-12 &&
      WINDOW_HEADROOM_SCAN.headroomSpread < 1e-12 &&
      Math.abs(WINDOW_HEADROOM_SCAN.headroomMin - 1.306) < 2e-3 &&
      Math.abs(WINDOW_HEADROOM_SCAN.alphaFloorMax - 1.0953) < 5e-4 &&
      Math.abs(WINDOW_HEADROOM_SCAN.alphaFloorMin - 1.0730) < 5e-4,
  },
  {
    id: 'imp95596-grh-saving-exponent-curve',
    description:
      's_H(beta) = (2 beta - 1)/(2 beta): 0 at beta = 1/2, 1/4 at the Airy width 2/3, reaches 1/2 only at beta = 1; operative barrier break-even beta ~0.719 (lo) / ~0.684 (hi) both > 2/3, so GRH saves nothing in [1/2, 2/3] and the 1.306 headroom is not reachable at any admissible width',
    holds: () =>
      Math.abs(GRH_SAVING_CURVE_LO.rows[0].sH) < 1e-12 &&
      Math.abs(GRH_SAVING_CURVE_LO.rows[GRH_SAVING_CURVE_LO.rows.length - 1].sH - 0.25) < 1e-9 &&
      Math.abs(GRH_SAVING_CURVE_LO.sHAtAiry - 0.25) < 1e-9 &&
      GRH_SAVING_CURVE_LO.betaReachesHalfLeading === 1 &&
      GRH_SAVING_CURVE_LO.reachesHalfInRange === false &&
      GRH_SAVING_CURVE_LO.betaBarrierOperative > 2 / 3 &&
      GRH_SAVING_CURVE_HI.betaBarrierOperative > 2 / 3 &&
      GRH_SAVING_CURVE_LO.betaBarrierAboveAiry === true &&
      GRH_SAVING_CURVE_LO.headroomReachableAtWidth === false &&
      GRH_SAVING_CURVE_LO.rhoAtAiry > 1 &&
      Math.abs(GRH_SAVING_CURVE_LO.betaBarrierOperative - 0.7192) < 5e-3,
  },
  {
    id: 'imp95657-two-sided-nogo-named-constants',
    description:
      'STANDING two-sided no-go constants pinned together: achievable A_{k,h} exponent 0 (trivial H^1) vs target 1/2 both UNCONDITIONALLY and under GRH at the Fresnel width; square-root-cancellation saving factor H^{-1/2} = 1.22e-4 ~ 1e-4 at the floor alias (over-closes the minimal 1.306 headroom by ~4 orders); RH short-interval barrier ratio sqrt(u) log^2 u / H = 100.5 > 1 at N_lo and > 1 at N_hi, so the width sits below the barrier throughout and GRH is inert',
    holds: () =>
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.primeSide.exponentAchievable === 0 &&
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.primeSide.exponentTarget === 0.5 &&
      Math.abs(Math.pow(FLOOR_LO.H, -0.5) - 1.22e-4) < 1e-5 &&
      Math.pow(FLOOR_LO.H, -0.5) < HEADROOM_FACTOR / 1e3 &&
      Math.abs(FLOOR_LO.rhBarrierRatio - 100.5) < 0.5 &&
      FLOOR_LO.rhBarrierRatio > 1 &&
      FLOOR_HI.rhBarrierRatio > 1,
  },
  {
    id: 'imp95675-partial-saving-budget',
    description:
      'intermediate regime: theta_min = log(1.306)/log H ~ 0.01482 (floor alias N_lo, H ~ 6.7e7), largest at the smallest H so uniform over the window; c_min ~ 0.0774 (single log-power); exponent budget 1/2 - theta_min ~ 0.485 (~33.7x over-close), H^{-1/2} over-closes the required 1/1.306 by ~3.80 orders; achievable exponent 0 < theta_min so no available sub-square-root saving clears 1.306',
    holds: () =>
      Math.abs(PARTIAL_SAVING_LO.thetaMin - 0.01482) < 5e-4 &&
      PARTIAL_SAVING_LO.thetaMin > PARTIAL_SAVING_HI.thetaMin &&
      Math.abs(PARTIAL_SAVING_LO.cMin - 0.0774) < 2e-3 &&
      Math.abs(PARTIAL_SAVING_LO.exponentBudget - 0.485) < 2e-3 &&
      Math.abs(PARTIAL_SAVING_LO.overCloseOrders - 3.80) < 0.2 &&
      PARTIAL_SAVING_LO.achievableExponent === 0 &&
      PARTIAL_SAVING_LO.minimalAboveAchievable === true &&
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.numbers.partialSavingBudget.anySubSqrtSavingClears1306 === false,
  },
  {
    id: 'imp95519-honesty-gate-no-qed',
    description: 'no-go only: promotes no bound, exponent achievable 0 < target 1/2, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.promotesBound === false &&
      IMP95519_LOCALIZED_BARRIER_SUM_NOGO.primeSide.exponentAchievable < IMP95519_LOCALIZED_BARRIER_SUM_NOGO.primeSide.exponentTarget &&
      /NO QED/.test(IMP95519_LOCALIZED_BARRIER_SUM_NOGO.verdict) &&
      /refereed bound is changed/i.test(IMP95519_LOCALIZED_BARRIER_SUM_NOGO.verdict),
  },
];

for (const a of IMP95519_LOCALIZED_BARRIER_SUM_NOGO_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95519-localized-barrier-sum-prime-zero-nogo assertion failed: ${a.id}`);
  }
}

export default IMP95519_LOCALIZED_BARRIER_SUM_NOGO;
