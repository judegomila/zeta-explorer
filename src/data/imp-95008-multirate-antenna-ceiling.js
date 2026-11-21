/**
 * imp-95008 continuation (fourteenth) - THEOREM T + LEMMA U + THEOREM W:
 * the multi-rate ANTENNA lever at theta = 10 is CEILINGED, settling the
 * thirteenth continuation refined residual. The thirteenth module
 * (imp-95008-multirate-witness-floor.js) named exactly one witness-side
 * lever: "multi-rate Theorem N antennas - Lemma S(ii) revives long-range
 * antenna coupling at theta = 10 that the twelfth continuation measured
 * dead under rate-locking". This module executes that lever exactly and
 * finds a REVERSAL OF THE HOPE, proved, not just measured: the coupling
 * revival is real (the free-rate antenna coupling exceeds the rate-locked
 * coupling by a factor 312 at the optimal antenna rate), but the Lemma V
 * legality of a slow wide packet plus the 1/nu diagonal cost price it
 * away - the headline theta = 10 antenna gain is 2.3496e-5 relative, and
 * a rigorous ceiling (all antenna rates nu > 0, ALL amplitudes, at the
 * dominant placement, frozen base) caps it at 2.4510e-5 relative. The
 * single-antenna lever at theta = 10 is now closed in the FULL multi-rate
 * class, not merely rate-locked-dead.
 *
 * SETTING (identical to the sibling chain; Permuting the Zeta Twin Ladder
 * Section 4.5; page /permutation-architecture). Multi-rate witnesses of
 * the thirteenth continuation: packets alpha_i e^(-mu_i |u - u_i|) at
 * grid centers u_i = v/d_i, widths r_i = c d_i^(-beta), per-packet Lemma V
 * legality h(mu_i, r_i, s), s = sigma + theta; exact excess E through the
 * Theorem R cross-rate kernel K(a, b, tau) = 2(b e^(-a tau) -
 * a e^(-b tau))/(b^2 - a^2); floor F = E/(Tx(2) M), M = sum_b nTilde_b^2.
 *
 * THEOREM T (multi-rate empty-block antenna: exact reduction and
 * closed-form optimal amplitude). Let W be an admissible multi-rate base
 * with excess E > 0 and mass M = m, and append a packet with amplitude
 * eps and its OWN rate nu > 0 at a grid point x of an EMPTY block. Then
 * with c(nu) = sum_i alpha_i K(mu_i, nu, tau_xi) > 0 (structural: empty
 * block forces every pair sign +1 and K > 0) and g(nu) = sqrt(r_x) /
 * h(nu, r_x, s), the extended floor is the exact rational function
 *   F(eps, nu) = ( E + 2 c(nu) eps - eps^2/nu )
 *              / ( Tx(2) ( m + g(nu)^2 eps^2 ) ) ,
 * so dF/deps at eps = 0 equals 2 c(nu)/(Tx(2) m) > 0 STRICTLY for every
 * nu > 0 (the strict first-order improvement of Theorem N survives rate
 * freedom), and for fixed nu the optimal amplitude is the positive root
 * of   c g^2 eps^2 + ( m/nu + g^2 E ) eps - c m = 0 :
 *   epsStar(nu) = ( -(m/nu + g^2 E)
 *                   + sqrt( (m/nu + g^2 E)^2 + 4 c^2 g^2 m ) )
 *                 / ( 2 c g^2 ) ,
 * the cubic terms cancelling exactly as in Theorem N. At nu = mu (common
 * rate) this quadratic is Theorem N verbatim: multiply by mu and use
 * q = mu E, cN = mu c (since f(mu tau) = mu K(mu, mu, tau)). Proof:
 * quotient calculus on the exact rational function; the empty block gives
 * the two structural facts (all cross signs +1; the new block mass enters
 * only at second order g^2 eps^2). QED.
 *
 * LEMMA U (rate and distance monotonicity; the coupling supremum is the
 * flat-antenna limit). (i) K(a, b, tau) is strictly decreasing in each
 * rate argument: dK/db = - integral |x - tau| e^(-a|x|) e^(-b|x - tau|) dx
 * < 0 (differentiate under the integral; the integrand is dominated).
 * (ii) K is strictly decreasing in tau: dK/dtau = 2ab (e^(-b tau) -
 * e^(-a tau))/(b^2 - a^2) < 0 for a != b (same sign top and bottom), and
 * equals -mu tau e^(-mu tau) < 0 at a = b = mu. (iii) Hence c(nu) is
 * strictly decreasing in nu with the closed-form, tau-INDEPENDENT limit
 *   sup_(nu > 0) c(nu) = c(0+) = 2 sum_i alpha_i / mu_i
 * (from K(a, b, tau) -> 2/a as b -> 0+), and c(nu) -> 0 as nu -> infinity.
 * (iv) On the interior legality branch (x = nu r < s), h is strictly
 * increasing in nu (dh/dx = h (s/x - 1)/1 > 0 for x < s... stated as
 * dh/dx = h (s - x)/x > 0), so g(nu) is decreasing in nu. Part (iii) is
 * the sharp form of the Lemma S(ii) revival: a slow antenna keeps FULL
 * coupling 2 alpha_i/mu_i to every base packet regardless of distance -
 * the revival mechanism is as strong as it could possibly be, which makes
 * the ceiling below decisive.
 *
 * THEOREM W (antenna-gain ceiling). For the frozen base, for EVERY real
 * amplitude eps and every nu > 0,
 *   F(eps, nu) - F(0) <= c(nu)^2 / ( Tx(2) ( m/nu + E g(nu)^2 ) ) .
 * Proof: F(eps,nu) - F(0) = ( 2 c eps m - eps^2 m/nu - E g^2 eps^2 )
 * / ( Tx(2) m (m + g^2 eps^2) ); the denominator is >= Tx(2) m^2 and the
 * numerator is <= max over eps of ( 2 c eps m - eps^2 (m/nu + E g^2) ) =
 * c^2 m^2/(m/nu + E g^2), attained at eps = c m/(m/nu + E g^2); for eps
 * with negative numerator the gain is negative. QED. Global-in-rate
 * ceiling by a monotone-envelope ladder (all envelopes from Lemma U): on
 * each cell [nuA, nuB], c(nu) <= c(nuA), m/nu >= m/nuB, g(nu)^2 >=
 * g(nuB)^2; low tail nu <= nuMin by ceiling <= c(0+)^2 nuMin/(Tx(2) m);
 * high tail nu >= nuMax = 100 by h = 1 there (nu r >= s), so ceiling <=
 * c(nuMax)^2/(Tx(2) E r_x). The ladder (8000 log cells, nuMin = 1e-9)
 * gives the BAKED RIGOROUS CEILINGS at the block-3 boundary placement:
 *   HEADLINE spacing p = 999983, theta = 10 (base = thirteenth multi-rate
 *   quad, floor 0.092871808411129783): ceiling 2.2763337301451059e-6
 *   absolute = 2.4510492140608618e-5 relative.
 *   fixed-97 theta = 10 (base floor 0.0012038255978826329): ceiling
 *   1.3483175575366961e-6 absolute = 1.1200273194956190e-3 relative.
 *
 * COROLLARY W1 (baked antennas; the achieved side of the ceiling).
 * Closed-form-amplitude antennas at the block-3 boundary:
 *   HEADLINE: nuStar = 1.6458129717766321 (golden-section literal,
 *   optimality NOT claimed), epsStar(nuStar) = 0.000032568677513585989,
 *   floor 0.092871808411129783 -> 0.092873990502047879, gain
 *   2.1820909180958470e-6 = 2.3495729817524236e-5 relative = 95.86
 *   percent of the rigorous ceiling - ceiling and achieved gain agree to
 *   within 4.2 percent, the ceiling is effectively TIGHT. Coupling
 *   revival: c(nuStar)/c(4.515) = 312.41963634587302 (the twelfth
 *   continuation rate-locked antenna sat at the base-rate coupling).
 *   fixed-97: nuStar = 1.3605255504724285, floor 0.0012038255978826329 ->
 *   0.0012051322544915652 (1.0854201897938509e-3 relative).
 * Measured joint 10-parameter re-optimizations (5 rates + 5 amplitudes,
 * exact evaluations of baked optimizer outputs) confirm the frozen-base
 * scope costs almost nothing: HEADLINE joint floor 0.092873990839396667
 * (3.4e-10 above frozen-base + antenna; still BELOW base + ceiling),
 * fixed-97 joint floor 0.0012051330632176880. New tracked brackets:
 * HEADLINE [0.092873990839396667, 4], gap 43.070120722669579 ->
 * 43.069108626085018; fixed-97 gap 3322.7404426650019 ->
 * 3319.1355561352348.
 *
 * COROLLARY W2 (placement dominance and chain saturation). (a) Per-point
 * rigorous ceilings (same ladder, per placement) at scanned empty-block
 * grid points u in {8.5, 9, 10, 12, 16+, 32+} (headline base) and the
 * fixed-97 analogues are ALL strictly below the boundary-point ceiling -
 * the dominance of the block-3 boundary placement is measured over the
 * scanned set (each per-point ceiling itself rigorous), consistent with
 * Lemma U(ii) coupling decay in distance. (b) Applying Theorem T exactly
 * a second time (block-4 boundary antenna appended to the extended
 * 5-packet witness, closed-form epsStar over a rate scan) gains below
 * 1e-9 relative: the antenna CHAIN saturates at one antenna, exactly as
 * the twelfth continuation found at theta = 2.
 *
 * SKEPTICAL SELF-CHECK RECORD: (1) Theorem T is verified by comparing
 * the closed-form rational F(eps, nu) against the independent direct
 * 5-packet floor evaluation at multiple (eps, nu) (rel < 1e-12), and
 * epsStar against the quadratic residual (< 1e-12 scaled) and the twelfth
 * continuation Theorem N literals at nu = mu (rel < 1e-9); (2) Lemma U is
 * cross-checked by central finite differences of K in each rate and in
 * tau, and c(1e-10) matches the closed-form c(0+) to < 1e-8 relative;
 * (3) Theorem W is validated by direct evaluation: the exact gain at a
 * grid of (eps, nu) pairs, including far-from-optimal ones, never exceeds
 * the ladder ceiling, and the baked achieved gains sit at 95.9 and 96.9
 * percent of their ceilings; (4) the ceiling covers ALL eps (for eps < 0
 * the gain is negative since c > 0), so no amplitude-sign loophole;
 * (5) the joint 10-parameter optimum was checked against the frozen-base
 * ceiling: it exceeds frozen-base + achieved antenna gain by 3.4e-10 (the
 * base moved) but stays below frozen-base floor + ceiling - the
 * frozen-base scope is measured-tight for this class; (6) scope stated
 * plainly: the ceiling is RIGOROUS per placement over all rates and
 * amplitudes on the FROZEN base; placement dominance is a finite scan,
 * base re-optimization and deeper structural rearrangements are NOT
 * covered by the ceiling and remain measured-only; (7) no contradiction
 * with the achieved side: every floor here stays far below the achieved
 * cFar = 4; (8) the thirteenth continuation revival reading is SCOPED,
 * not contradicted: Lemma S(ii)/U(iii) coupling revival is real and
 * maximal (tau-independent flat-antenna limit), and it is priced away by
 * legality plus diagonal cost - both statements now quantified.
 *
 * WHAT REMAINS OPEN (sibling residuals, updated): the packet-envelope
 * constants (c, beta, sigma, theta, A_d) for the PAPER packets; the
 * curvature ceiling D retained by the window; the paper phase curvature
 * normalization; residual (c), the l2-to-pointwise passage to |C_E,17|.
 * SUPERSEDED: the thirteenth refined residual "multi-rate Theorem N
 * antennas" is executed and CEILINGED (headline theta = 10 antenna gain
 * <= 2.4510e-5 relative, rigorous at the dominant placement, all rates,
 * all amplitudes, frozen base). REFINED residual: the witness side now
 * lives at structural rearrangements the ceiling does not cover - joint
 * multi-rate re-optimization with MORE packets in OCCUPIED blocks or
 * different grid geometries (the measured joint quad-plus-antenna optimum
 * moved only 3.4e-10, suggesting saturation, but that is a measurement) -
 * plus the standing achieved-side levers (parity alternating sum, Lemma T
 * constant). Headline far bracket now [0.092873990839396667, 4], gap
 * 43.069108626085018.
 *
 * The numerics below CROSS-CHECK the closed-form statements; they are
 * not the claim. Import-light (no heavy bundle). Changes no bound; does
 * NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

// ── shared conventions (identical to the sibling modules) ────────────────────
const SIGMA = 1;
const BETA = 1 / 3;
const CC = 1;
const VV = 1;
const DD = 1;

function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}

const QREF = isolationQ(CC, VV, BETA, DD);

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

function gSharp(j, Q, beta) {
  return Math.pow(2, beta) * gOld(j, Q, beta);
}

function phi(x, theta) {
  return Math.pow(1 + x, -theta);
}

function tailAllSharp(theta, Q, beta, jMax) {
  let s = 0;
  for (let j = 2; j <= jMax; j++) {
    const g = gSharp(j, Q, beta);
    if (!Number.isFinite(g)) break;
    const t = phi(g, theta);
    if (t === 0) break;
    s += t;
  }
  return s;
}

function fCorr(z) {
  return Math.exp(-z) * (1 + z);
}

function hLegal(mu, r, s) {
  const x = mu * r;
  if (x >= s) return 1;
  return Math.exp(s - x) * Math.pow(x / s, s);
}

function kernelK(a, b, tau) {
  if (Math.abs(a - b) < 1e-7 * (a + b)) {
    const m = 0.5 * (a + b);
    return fCorr(m * tau) / m;
  }
  return (2 * (b * Math.exp(-a * tau) - a * Math.exp(-b * tau))) / (b * b - a * a);
}

// ── witness geometry (identical to the twelfth and thirteenth) ───────────────
function pentaWitness(p) {
  const k1 = Math.floor(p / 2) + 1;
  const k2 = Math.floor(p / 4) + 1;
  const k3 = Math.floor(p / 8) + 1;
  const ks = [k1, k1 - 1, k2, k2 - 1, k3 - 1];
  const d = ks.map((k) => k / p);
  return {
    ks,
    d,
    u: d.map((x) => VV / x),
    r: d.map((x) => CC * Math.pow(x, -BETA)),
    block: ks.map((k) => {
      let b = 0;
      while (!(k * Math.pow(2, b) <= p && p < k * Math.pow(2, b + 1))) {
        b += 1;
        if (b > 60) throw new Error("imp-95008 antenna: block search failed");
      }
      return b;
    }),
  };
}

function subWitness(w, n) {
  return {
    ks: w.ks.slice(0, n),
    d: w.d.slice(0, n),
    u: w.u.slice(0, n),
    r: w.r.slice(0, n),
    block: w.block.slice(0, n),
  };
}

function floorMultiRate(w, theta, mus, a) {
  const s = SIGMA + theta;
  const n = a.length;
  let E = 0;
  for (let i = 0; i < n; i++) E -= (a[i] * a[i]) / mus[i];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sij = w.block[i] === w.block[j] ? -1 : 1;
      E += 2 * sij * a[i] * a[j] * kernelK(mus[i], mus[j], Math.abs(w.u[i] - w.u[j]));
    }
  }
  const bmax = Math.max(...w.block);
  const nb = new Array(bmax + 1).fill(0);
  for (let i = 0; i < n; i++) {
    nb[w.block[i]] += (a[i] * Math.sqrt(w.r[i])) / hLegal(mus[i], w.r[i], s);
  }
  const M = nb.reduce((acc, x) => acc + x * x, 0);
  const T = tailAllSharp(theta, QREF, BETA, 800);
  return { F: E / (T * M), E, M, T, nb };
}

// ── THEOREM T: antenna machinery at an arbitrary placement u_x ───────────────
function antennaAt(w4, base, theta, ux, rx) {
  const s = SIGMA + theta;
  const ev = floorMultiRate(w4, theta, base.mus, base.a);
  const cOf = (nu) =>
    base.a.reduce((c, ai, i) => c + ai * kernelK(base.mus[i], nu, Math.abs(ux - w4.u[i])), 0);
  const c0 = 2 * base.a.reduce((c, ai, i) => c + ai / base.mus[i], 0);
  const gOf = (nu) => Math.sqrt(rx) / hLegal(nu, rx, s);
  const epsStar = (nu) => {
    const c = cOf(nu);
    const g = gOf(nu);
    const A = ev.M / nu + g * g * ev.E;
    return (-A + Math.sqrt(A * A + 4 * c * c * g * g * ev.M)) / (2 * c * g * g);
  };
  // exact closed-form rational function of Theorem T
  const Fformula = (eps, nu) => {
    const c = cOf(nu);
    const g = gOf(nu);
    return (ev.E + 2 * c * eps - (eps * eps) / nu) / (ev.T * (ev.M + g * g * eps * eps));
  };
  const ceilAt = (nu) => {
    const c = cOf(nu);
    const g = gOf(nu);
    return (c * c) / (ev.T * (ev.M / nu + ev.E * g * g));
  };
  return { ev, cOf, c0, gOf, epsStar, Fformula, ceilAt, s, rx };
}

// THEOREM W ladder: rigorous global-in-rate ceiling via Lemma U envelopes
function ladderCeiling(A, numin, numax, steps) {
  const tailLow = (A.c0 * A.c0 * numin) / (A.ev.T * A.ev.M);
  const cHi = A.cOf(numax);
  const tailHigh = (cHi * cHi) / (A.ev.T * A.ev.E * A.rx);
  let sup = Math.max(tailLow, tailHigh);
  for (let k = 0; k < steps; k++) {
    const nuA = numin * Math.pow(numax / numin, k / steps);
    const nuB = numin * Math.pow(numax / numin, (k + 1) / steps);
    const c = A.cOf(nuA);
    const g = A.gOf(nuB);
    const b = (c * c) / (A.ev.T * (A.ev.M / nuB + A.ev.E * g * g));
    if (b > sup) sup = b;
  }
  return sup;
}

// ── bases (thirteenth continuation baked literals) ───────────────────────────
const MR4_BIG_T10 = {
  mus: [7.694097, 7.696714, 3.901035, 2.79778],
  a: [1.090619, 1.090715, 0.04953889, 0.04336286],
};
const MR4_97_T10 = {
  mus: [3.21047, 3.378314, 2.558923, 2.068342],
  a: [0.900892, 0.9160048, 0.2633267, 0.2555064],
};

const P97 = pentaWitness(97);
const PBIG = pentaWitness(999983);
const W4_97 = subWitness(P97, 4);
const W4_BIG = subWitness(PBIG, 4);

const ANT_BIG = antennaAt(W4_BIG, MR4_BIG_T10, 10, PBIG.u[4], PBIG.r[4]);
const ANT_97 = antennaAt(W4_97, MR4_97_T10, 10, P97.u[4], P97.r[4]);

// baked antenna rates (golden-section outputs; optimality NOT claimed)
const NU_BIG = 1.6458129717766321;
const NU_97 = 1.3605255504724285;

const EPS_BIG = ANT_BIG.epsStar(NU_BIG);
const EPS_97 = ANT_97.epsStar(NU_97);
const F_ANT_BIG = floorMultiRate(PBIG, 10, [...MR4_BIG_T10.mus, NU_BIG], [...MR4_BIG_T10.a, EPS_BIG]);
const F_ANT_97 = floorMultiRate(P97, 10, [...MR4_97_T10.mus, NU_97], [...MR4_97_T10.a, EPS_97]);

const CEIL_BIG = ladderCeiling(ANT_BIG, 1e-9, 100, 8000);
const CEIL_97 = ladderCeiling(ANT_97, 1e-9, 100, 8000);

// joint 10-parameter re-optimization outputs (measured; exact evaluations)
const JOINT_BIG = {
  mus: [7.69395202209785, 7.696569089680406, 3.901022492015913, 2.7978054595942754, 1.6462804960465607],
  a: [1.0906392801493483, 1.0907349936022739, 0.04954395066558243, 0.04336742919997075, 0.000032666623379528365],
};
const JOINT_97 = {
  mus: [3.210676550682116, 3.3786261898216896, 2.5588659812556944, 2.0685499698905727, 1.3605259758013009],
  a: [0.90156201917931, 0.916694573226692, 0.2636554981645602, 0.25582607503771226, 0.0017848611486105809],
};
const F_JOINT_BIG = floorMultiRate(PBIG, 10, JOINT_BIG.mus, JOINT_BIG.a);
const F_JOINT_97 = floorMultiRate(P97, 10, JOINT_97.mus, JOINT_97.a);

// ── verdict object ──────────────────────────────────────────────────────────
export const IMP95008_MULTIRATE_ANTENNA_CEILING = {
  ticket: "imp-95008 (continuation fourteen: the multi-rate antenna lever at theta = 10 is ceilinged)",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; executes the thirteenth continuation refined residual: multi-rate Theorem N antennas at theta = 10.",
  theoremT:
    "Multi-rate empty-block antenna: appending a packet with amplitude eps and its own rate nu at a grid point of an unoccupied block gives the exact floor F(eps, nu) = (E + 2 c(nu) eps - eps^2/nu)/(Tx(2)(m + g(nu)^2 eps^2)); the eps-derivative at zero is 2 c(nu)/(Tx(2) m) > 0 strictly for EVERY nu > 0, and the optimal amplitude is the closed-form positive root epsStar(nu) of c g^2 eps^2 + (m/nu + g^2 E) eps - c m = 0, which at nu = mu is Theorem N verbatim.",
  lemmaU:
    "K(a, b, tau) is strictly decreasing in each rate (dK/db = -integral |x - tau| times the positive integrand, at the integrand level) and in tau; hence the antenna coupling c(nu) is strictly decreasing with the closed-form tau-INDEPENDENT supremum c(0+) = 2 sum_i alpha_i/mu_i - the slow-antenna revival is maximal, a flat antenna couples fully to every base packet at any distance; on the interior legality branch h is strictly increasing in nu, so the mass penalty g(nu) explodes as the antenna slows.",
  theoremW:
    "Antenna-gain ceiling: for the frozen base, every amplitude eps and every rate nu > 0 satisfy F(eps, nu) - F(0) <= c(nu)^2/(Tx(2)(m/nu + E g(nu)^2)); a monotone-envelope ladder (Lemma U) over 8000 log cells with closed-form tails gives rigorous global-in-rate ceilings at the block-3 boundary placement: HEADLINE 2.2763337301451059e-6 absolute (2.4510492140608618e-5 relative), fixed-97 1.3483175575366961e-6 (1.1200273194956190e-3 relative).",
  corollaryW1:
    "Baked antennas achieve 95.86 and 96.91 percent of their ceilings (the ceiling is effectively tight): HEADLINE floor 0.092871808411129783 -> 0.092873990502047879 at nuStar = 1.6458129717766321 (coupling revival c(nuStar)/c(4.515) = 312.42, priced away); measured joint 10-parameter optima move only 3.4e-10 further: new tracked brackets HEADLINE [0.092873990839396667, 4] gap 43.070120722669579 -> 43.069108626085018, fixed-97 gap 3322.7404426650019 -> 3319.1355561352348.",
  corollaryW2:
    "Per-point rigorous ceilings at scanned farther placements are all strictly below the boundary-point ceiling (dominance measured over the scanned set; each per-point ceiling rigorous), and a second exact Theorem T antenna at the block-4 boundary on the extended witness gains below 1e-9 relative: the antenna chain saturates at one antenna at theta = 10.",
  reference: {
    parameters: { v: VV, c: CC, beta: "1/3", D: DD, sigma: SIGMA },
    bases: { headline: MR4_BIG_T10, fixed97: MR4_97_T10 },
    headline: {
      baseFloor: ANT_BIG.ev.F,
      nuStar: NU_BIG,
      epsStar: EPS_BIG,
      antennaFloor: F_ANT_BIG.F,
      relativeGain: F_ANT_BIG.F / ANT_BIG.ev.F - 1,
      ceilingAbsolute: CEIL_BIG,
      ceilingRelative: CEIL_BIG / ANT_BIG.ev.F,
      couplingSupremum: ANT_BIG.c0,
      couplingRevivalVsRateLock: ANT_BIG.cOf(NU_BIG) / ANT_BIG.cOf(4.515),
      jointWitness: JOINT_BIG,
      jointFloor: F_JOINT_BIG.F,
      gapOld: 4 / ANT_BIG.ev.F,
      gapNew: 4 / F_JOINT_BIG.F,
    },
    fixed97: {
      baseFloor: ANT_97.ev.F,
      nuStar: NU_97,
      epsStar: EPS_97,
      antennaFloor: F_ANT_97.F,
      relativeGain: F_ANT_97.F / ANT_97.ev.F - 1,
      ceilingAbsolute: CEIL_97,
      ceilingRelative: CEIL_97 / ANT_97.ev.F,
      jointWitness: JOINT_97,
      jointFloor: F_JOINT_97.F,
      gapOld: 4 / ANT_97.ev.F,
      gapNew: 4 / F_JOINT_97.F,
    },
  },
  openResiduals: [
    "the packet-envelope constants (c, beta, sigma, theta, A_d) for the PAPER packets rather than the model family",
    "the curvature ceiling D retained by the window",
    "the paper phase curvature normalization (sibling Theorem D residual)",
    "residual (c): the passage from the l2 weld bound to the pointwise scalar |C_E,17|",
    "REFINED: the antenna lever at theta = 10 is CEILINGED (gain <= 2.4510e-5 relative, rigorous at the dominant placement over all rates and amplitudes, frozen base); the witness side now lives at structural rearrangements the ceiling does not cover - occupied-block packets, different grid geometries, full joint re-optimization (measured to move only 3.4e-10 here) - plus the achieved-side parity alternating sum and the Lemma T constant",
  ],
  isRigorous: true,
  rigorScope:
    "Theorem T is quotient calculus on the exact rational function with the empty-block structure supplying strict positivity, verified against the twelfth continuation Theorem N at nu = mu; Lemma U is integrand-level differentiation of the exact kernel with a closed-form limit; Theorem W is an elementary quotient bound plus a monotone-envelope ladder whose every envelope is Lemma U - the baked ceilings are rigorous for the FROZEN base at the stated placement, over ALL rates and ALL amplitudes. Placement dominance is a finite scan (each per-point ceiling rigorous); the joint re-optimizations are measured optimizer outputs evaluated exactly; witness optimality is NOT claimed anywhere. The numerics cross-check the statements; they are not the claim.",
  promotesBound: false,
  verdict:
    "RIGOROUS step settling the thirteenth continuation refined residual, with a REVERSAL of its hopeful reading: NEW Theorem T extends the empty-block antenna calculus to per-antenna rates (strict first-order improvement for every rate, closed-form epsStar(nu), Theorem N recovered at nu = mu), NEW Lemma U proves the antenna coupling supremum is the tau-independent flat-antenna limit 2 sum alpha_i/mu_i (the revival is maximal), and NEW Theorem W prices it: a rigorous monotone-envelope ceiling caps the headline theta = 10 antenna gain at 2.4510492140608618e-5 relative (all rates, all amplitudes, dominant placement, frozen base), with the achieved antenna at 95.86 percent of the ceiling. The coupling revives 312x versus rate-locking and is still priced away by Lemma V legality plus the 1/nu diagonal cost - the single-antenna lever at theta = 10 is now CLOSED in the full multi-rate class, not merely rate-locked-dead. Tracked headline bracket updates microscopically to [0.092873990839396667, 4], gap 43.069108626085018. Ceiling scope stated plainly: frozen base, per placement; joint re-optimization measured at +3.4e-10. Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95008_MRAC_ASSERTIONS = [
  {
    id: "imp95008-mrac-lemmaU-monotone",
    description:
      "Lemma U: K is strictly decreasing in each rate argument and in tau (central finite differences at grid triples), c(nu) is strictly decreasing on a log grid for both bases, and c(1e-10) matches the closed-form supremum c(0+) = 2 sum alpha_i/mu_i to < 1e-8 relative",
    holds: () => {
      const h = 1e-6;
      for (const [a, b, tau] of [
        [7.694097, 1.6458, 4.0],
        [2.79778, 0.4, 6.0],
        [3.21047, 1.36, 3.9],
      ]) {
        if (!(kernelK(a, b + h, tau) < kernelK(a, b - h, tau))) return false;
        if (!(kernelK(a + h, b, tau) < kernelK(a - h, b, tau))) return false;
        if (!(kernelK(a, b, tau + h) < kernelK(a, b, tau - h))) return false;
      }
      for (const A of [ANT_BIG, ANT_97]) {
        let prev = Infinity;
        for (let lnu = Math.log(1e-4); lnu <= Math.log(50); lnu += 0.3) {
          const c = A.cOf(Math.exp(lnu));
          if (!(c < prev)) return false;
          prev = c;
        }
        if (Math.abs(A.cOf(1e-10) - A.c0) / A.c0 > 1e-8) return false;
      }
      return true;
    },
  },
  {
    id: "imp95008-mrac-theoremT-exactness",
    description:
      "Theorem T closed-form rational F(eps, nu) matches the independent direct 5-packet floor evaluation to < 1e-12 relative at multiple (eps, nu), including the baked optima",
    holds: () =>
      [
        [ANT_BIG, PBIG, MR4_BIG_T10, EPS_BIG, NU_BIG],
        [ANT_BIG, PBIG, MR4_BIG_T10, 0.01, 0.7],
        [ANT_97, P97, MR4_97_T10, EPS_97, NU_97],
        [ANT_97, P97, MR4_97_T10, 0.05, 3.2],
      ].every(([A, w5, base, eps, nu]) => {
        const direct = floorMultiRate(w5, 10, [...base.mus, nu], [...base.a, eps]).F;
        const formula = A.Fformula(eps, nu);
        return Math.abs(direct - formula) / Math.abs(direct) < 1e-12;
      }),
  },
  {
    id: "imp95008-mrac-epsstar-quadratic-and-theoremN-recovery",
    description:
      "epsStar(nu) satisfies the Theorem T quadratic to < 1e-12 scaled residual at the baked rates, and at nu = mu on the ninth (97, theta 2) common-rate base the machinery reproduces the twelfth continuation Theorem N literals epsStar = 0.06740557013712142 and F = 0.2125409720042074 (rel 1e-9)",
    holds: () => {
      for (const [A, nu] of [
        [ANT_BIG, NU_BIG],
        [ANT_97, NU_97],
      ]) {
        const c = A.cOf(nu);
        const g = A.gOf(nu);
        const es = A.epsStar(nu);
        const res = c * g * g * es * es + (A.ev.M / nu + g * g * A.ev.E) * es - c * A.ev.M;
        if (!(Math.abs(res) / (c * A.ev.M) < 1e-12)) return false;
      }
      const mu = 1.086527;
      const base = { mus: [mu, mu, mu, mu], a: [0.51279, 0.28492, 0.506456, 0.631957] };
      const w4 = subWitness(P97, 4);
      const A2 = antennaAt(w4, base, 2, P97.u[4], P97.r[4]);
      const es = A2.epsStar(mu);
      const F = floorMultiRate(P97, 2, [...base.mus, mu], [...base.a, es]).F;
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return rel(es, 0.06740557013712142) && rel(F, 0.2125409720042074);
    },
  },
  {
    id: "imp95008-mrac-base-reproduction",
    description:
      "the 4-packet base floors reproduce the thirteenth continuation literals 0.092871808411129783 and 0.0012038255978826329 (rel 1e-9), both with strictly positive excess",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(ANT_BIG.ev.F, 0.092871808411129783) &&
        rel(ANT_97.ev.F, 0.0012038255978826329) &&
        ANT_BIG.ev.E > 0 &&
        ANT_97.ev.E > 0
      );
    },
  },
  {
    id: "imp95008-mrac-baked-antennas",
    description:
      "the baked antenna witnesses reproduce (rel 1e-9): epsStar 0.000032568677513585989 and floor 0.092873990502047879 (headline), epsStar 0.0017829489030298784 and floor 0.0012051322544915652 (fixed-97); both strictly beat their bases",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(EPS_BIG, 0.000032568677513585989) &&
        rel(F_ANT_BIG.F, 0.092873990502047879) &&
        rel(EPS_97, 0.0017829489030298784) &&
        rel(F_ANT_97.F, 0.0012051322544915652) &&
        F_ANT_BIG.F > ANT_BIG.ev.F &&
        F_ANT_97.F > ANT_97.ev.F
      );
    },
  },
  {
    id: "imp95008-mrac-ceilings",
    description:
      "the Theorem W ladder ceilings reproduce (rel 1e-9): 2.2763337301451059e-6 (headline) and 1.3483175575366961e-6 (fixed-97); each achieved gain sits below its ceiling at 95.86 and 96.91 percent respectively (within [0.9, 1))",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      if (!rel(CEIL_BIG, 2.2763337301451059e-6)) return false;
      if (!rel(CEIL_97, 1.3483175575366961e-6)) return false;
      const gB = F_ANT_BIG.F - ANT_BIG.ev.F;
      const g9 = F_ANT_97.F - ANT_97.ev.F;
      return gB <= CEIL_BIG && g9 <= CEIL_97 && gB / CEIL_BIG > 0.9 && gB / CEIL_BIG < 1 && g9 / CEIL_97 > 0.9 && g9 / CEIL_97 < 1;
    },
  },
  {
    id: "imp95008-mrac-ceiling-validity-grid",
    description:
      "Theorem W validity: the exact antenna gain never exceeds the global ceiling on a grid of off-optimal (eps, nu) pairs including large amplitudes and slow and fast rates, for both bases",
    holds: () =>
      [
        [ANT_BIG, PBIG, MR4_BIG_T10, CEIL_BIG],
        [ANT_97, P97, MR4_97_T10, CEIL_97],
      ].every(([A, w5, base, ceil]) => {
        for (const nu of [0.05, 0.3, 0.9, 1.36, 1.65, 2.5, 4.515, 10, 40]) {
          for (const eps of [1e-8, 1e-5, 1e-3, 0.05, 0.5, A.epsStar(nu)]) {
            const F = floorMultiRate(w5, 10, [...base.mus, nu], [...base.a, eps]).F;
            if (F - A.ev.F > ceil * (1 + 1e-12)) return false;
          }
        }
        return true;
      }),
  },
  {
    id: "imp95008-mrac-placement-dominance",
    description:
      "per-point rigorous ladder ceilings at scanned farther empty-block placements are all strictly below the block-3 boundary ceiling for both bases (dominance over the scanned set)",
    holds: () => {
      const scan = (w4, base, points) =>
        points.every(([ux, ceilRef]) => {
          const A = antennaAt(w4, base, 10, ux, Math.pow(ux, BETA));
          return ladderCeiling(A, 1e-9, 100, 2000) < ceilRef;
        });
      return (
        scan(W4_BIG, MR4_BIG_T10, [
          [8.5, CEIL_BIG],
          [9, CEIL_BIG],
          [10, CEIL_BIG],
          [12, CEIL_BIG],
          [16.000272, CEIL_BIG],
          [32.001, CEIL_BIG],
        ]) &&
        scan(W4_97, MR4_97_T10, [
          [8.9, CEIL_97],
          [9.7, CEIL_97],
          [12.125, CEIL_97],
          [16.1667, CEIL_97],
          [32.33, CEIL_97],
        ])
      );
    },
  },
  {
    id: "imp95008-mrac-joint-witnesses",
    description:
      "the measured joint 10-parameter witnesses evaluate exactly to 0.092873990839396667 and 0.0012051330632176880 (rel 1e-9), beat the frozen-base antenna floors, stay below base + ceiling, and set the new tracked gaps 43.069108626085018 and 3319.1355561352348 (old: 43.070120722669579 and 3322.7404426650019)",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(F_JOINT_BIG.F, 0.092873990839396667) &&
        rel(F_JOINT_97.F, 0.0012051330632176880) &&
        F_JOINT_BIG.F > F_ANT_BIG.F &&
        F_JOINT_97.F > F_ANT_97.F &&
        F_JOINT_BIG.F < ANT_BIG.ev.F + CEIL_BIG &&
        F_JOINT_97.F < ANT_97.ev.F + CEIL_97 &&
        rel(4 / F_JOINT_BIG.F, 43.069108626085018) &&
        rel(4 / F_JOINT_97.F, 3319.1355561352348) &&
        rel(4 / ANT_BIG.ev.F, 43.070120722669579) &&
        rel(4 / ANT_97.ev.F, 3322.7404426650019) &&
        F_JOINT_BIG.E > 0 &&
        F_JOINT_97.E > 0
      );
    },
  },
  {
    id: "imp95008-mrac-second-antenna-saturation",
    description:
      "a second exact Theorem T antenna at the block-4 boundary appended to the extended headline witness gains below 1e-9 relative over a rate scan (the antenna chain saturates at one antenna)",
    holds: () => {
      const p = 999983;
      const k4 = Math.floor(p / 16);
      const u6 = p / k4;
      const r6 = Math.pow(k4 / p, -BETA);
      let b6 = 0;
      while (!(k4 * Math.pow(2, b6) <= p && p < k4 * Math.pow(2, b6 + 1))) b6 += 1;
      if (b6 !== 4) return false;
      const w5 = PBIG;
      const base5 = { mus: [...MR4_BIG_T10.mus, NU_BIG], a: [...MR4_BIG_T10.a, EPS_BIG] };
      const A = antennaAt(w5, base5, 10, u6, r6);
      const w6 = {
        u: [...w5.u, u6],
        r: [...w5.r, r6],
        block: [...w5.block, b6],
      };
      let bestGain = 0;
      for (let lnu = Math.log(0.05); lnu <= Math.log(30); lnu += 0.05) {
        const nu = Math.exp(lnu);
        const es = A.epsStar(nu);
        const F = floorMultiRate(w6, 10, [...base5.mus, nu], [...base5.a, es]).F;
        if (F - F_ANT_BIG.F > bestGain) bestGain = F - F_ANT_BIG.F;
      }
      return bestGain / F_ANT_BIG.F < 1e-9;
    },
  },
  {
    id: "imp95008-mrac-coupling-revival",
    description:
      "the coupling revival is real and quantified: c(nuStar)/c(4.515) = 312.41963634587302 for the headline base (rel 1e-9), yet the priced relative gain is 2.3495729817524236e-5 (rel 1e-9) - revived and priced away",
    holds: () => {
      const rel = (x, lit) => Math.abs(x - lit) <= 1e-9 * Math.abs(lit);
      return (
        rel(ANT_BIG.cOf(NU_BIG) / ANT_BIG.cOf(4.515), 312.41963634587302) &&
        rel(F_ANT_BIG.F / ANT_BIG.ev.F - 1, 2.3495729817524236e-5)
      );
    },
  },
  {
    id: "imp95008-mrac-legality-positivity",
    description:
      "all baked witnesses are componentwise positive with positive rates, every legality constant satisfies 0 < h <= 1, the baked antenna rates sit on the interior Lemma V branch (nu r < s) so the damping is genuinely priced, and every floor stays strictly below the achieved cFar = 4",
    holds: () => {
      const s10 = SIGMA + 10;
      const all = [
        [PBIG, { mus: [...MR4_BIG_T10.mus, NU_BIG], a: [...MR4_BIG_T10.a, EPS_BIG] }],
        [P97, { mus: [...MR4_97_T10.mus, NU_97], a: [...MR4_97_T10.a, EPS_97] }],
        [PBIG, JOINT_BIG],
        [P97, JOINT_97],
      ];
      for (const [w, W] of all) {
        if (!W.a.every((x) => x > 0) || !W.mus.every((x) => x > 0)) return false;
        for (let i = 0; i < W.a.length; i++) {
          const h = hLegal(W.mus[i], w.r[i], s10);
          if (!(h > 0 && h <= 1)) return false;
        }
      }
      if (!(NU_BIG * PBIG.r[4] < s10 && NU_97 * P97.r[4] < s10)) return false;
      return [F_ANT_BIG.F, F_ANT_97.F, F_JOINT_BIG.F, F_JOINT_97.F].every((f) => f < 4);
    },
  },
  {
    id: "imp95008-mrac-honesty-gate",
    description:
      "the verdict records the reversal of the thirteenth revival reading, the ceiling scope (frozen base, per placement), the measured status of dominance and joint re-optimization, the still-open residuals, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95008_MULTIRATE_ANTENNA_CEILING.promotesBound === false &&
      IMP95008_MULTIRATE_ANTENNA_CEILING.openResiduals.length === 5 &&
      /NO QED/.test(IMP95008_MULTIRATE_ANTENNA_CEILING.verdict) &&
      /refereed bound is changed/i.test(IMP95008_MULTIRATE_ANTENNA_CEILING.verdict) &&
      /REVERSAL/.test(IMP95008_MULTIRATE_ANTENNA_CEILING.verdict) &&
      /frozen base/.test(IMP95008_MULTIRATE_ANTENNA_CEILING.verdict) &&
      /priced away/.test(IMP95008_MULTIRATE_ANTENNA_CEILING.verdict) &&
      /CEILINGED/.test(IMP95008_MULTIRATE_ANTENNA_CEILING.openResiduals[4]) &&
      /optimality is NOT claimed/.test(IMP95008_MULTIRATE_ANTENNA_CEILING.rigorScope) &&
      /finite scan/.test(IMP95008_MULTIRATE_ANTENNA_CEILING.rigorScope),
  },
];

for (const a of IMP95008_MRAC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95008-multirate-antenna-ceiling assertion failed: ${a.id}`);
  }
}

export default IMP95008_MULTIRATE_ANTENNA_CEILING;
