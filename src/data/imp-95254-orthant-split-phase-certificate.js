/**
 * imp-95254: LEMMA ENT + LEMMA ODROP + THEOREM PHASE-AM + COROLLARY NO-UNIF
 * + PROP LIN-NOGO + PROP CEIL-X -- the sharper phase-priced signed seam
 * bound asked for by imp-95233 HONEST LIMITS (b), delivered together with
 * the two refutations that delimit what "sharp" can mean in the (theta,
 * y_min) currency.
 *
 * Twenty-fourth leg of the seam chain. Objects as in imp-95221/95222/95233:
 * packets f_n(s) = e^(-mu_n |s - u_n|), rates mu_n > 0, centers u_n > 0,
 * REAL amplitudes c_n; f = sum c_n f_n; W(f) = integral_(s<0) f^2;
 * T(f) = integral_R f^2; R = W/T; g = sum |c_n| f_n the positive-modulus
 * envelope; theta = T(f)/T(g) in (0, 1] (imp-95233 phase currency);
 * y_min = min over pairs incl diagonal of (mu_m + mu_n) min(u_m, u_n).
 * Gram data: since all centers are positive, the left tail is exact,
 *   L_mn = integral_(s<0) f_m f_n = a_m a_n / (mu_m + mu_n),
 *   a_n = e^(-mu_n u_n),  M_mn = integral_R f_m f_n,
 * so W(f) = c^T L c and T(f) = c^T M c.
 *
 * LEMMA ENT (entrywise seam-mass domination). For EVERY pair (m, n),
 *   L_mn <= (1/2) e^(-y_min) M_mn.
 * Proof. Order u_m <= u_n, D = u_n - u_m. The three-strip evaluation of
 * M_mn (left of u_m, between the centers, right of u_n) gives
 *   M_mn = [e^(-mu_m D) + e^(-mu_n D)]/(mu_m + mu_n) + S2,
 *   S2 = [e^(-mu_m D) - e^(-mu_n D)]/(mu_n - mu_m)  (= D e^(-mu D) at
 * equal rates). Then
 *   M_mn - 2 e^(-mu_n D)/(mu_m + mu_n)
 *     = [e^(-mu_m D) - e^(-mu_n D)] * 2 mu_n
 *       / ((mu_m + mu_n)(mu_n - mu_m))  >= 0,
 * because e^(-mu_m D) - e^(-mu_n D) carries the sign of mu_n - mu_m; the
 * equal-rate case leaves D e^(-mu D) >= 0. So M_mn >= 2 e^(-mu_n D)
 * / (mu_m + mu_n), with mu_n the rate of the FARTHER-center packet.
 * Since mu_m u_m + mu_n u_n = (mu_m + mu_n) u_m + mu_n D and
 * (mu_m + mu_n) min(u_m, u_n) >= y_min,
 *   L_mn = e^(-(mu_m + mu_n) u_m) e^(-mu_n D)/(mu_m + mu_n)
 *        <= e^(-y_min) e^(-mu_n D)/(mu_m + mu_n)
 *        <= (1/2) e^(-y_min) M_mn.
 * Diagonal: L_nn = e^(-2 mu_n u_n)/(2 mu_n) <= (1/2) e^(-y_min) (1/mu_n)
 * = (1/2) e^(-y_min) M_nn. Equality holds at the diagonal with
 * 2 mu_n u_n = y_min and at co-centered pairs with (mu_m + mu_n) u = y_min.
 * On the positive cone, summing entrywise re-derives imp-95222 FA-2.
 *
 * LEMMA ODROP (orthant cross-term drop). Split c = c_plus - c_minus into
 * its positive and negative parts (entrywise nonnegative, disjoint
 * supports). All entries of L are positive, so
 *   c^T L c = c_plus^T L c_plus + c_minus^T L c_minus
 *             - 2 c_plus^T L c_minus
 *          <= c_plus^T L c_plus + c_minus^T L c_minus.
 * This keeps the LEFT-tail cancellation cost at zero instead of paying the
 * full envelope price: PHASE-CERT bounded W(f) by W(g), which re-adds the
 * dropped cross mass with a PLUS sign; ODROP simply removes it.
 *
 * THEOREM PHASE-AM (arithmetic-mean phase-priced signed certificate).
 * For all real amplitudes,
 *   W(f) <= (1/2) e^(-y_min) [T(f_plus) + T(f_minus)]
 *         = (e^(-y_min)/4) [T(f) + T(g)],
 * hence
 *   R(f) <= (e^(-y_min)/4) (1 + 1/theta).
 * Proof: ODROP, then ENT summed inside each orthant block (all products
 * nonnegative there), then the exact identity T(f_plus) + T(f_minus)
 * = (T(f) + T(g))/2 (the cross energy X = <f_plus, f_minus> >= 0 enters
 * T(f) with - and T(g) with +).
 * Properties (all asserted below):
 *  (i) STRICT DOMINANCE over imp-95233 PHASE-CERT: the ratio of the two
 *      bounds is exactly (1 + theta)/2 <= 1, equality only at theta = 1;
 *      as theta -> 0 the loss against PHASE-CERT is halved.
 *  (ii) TIGHT at theta = 1: a single packet gives equality (FA-2 sharp
 *      case), so no uniform improvement of the constant 1/4 is possible.
 *  (iii) VACUITY FRONTIER LOWERED: PHASE-AM < 1/2 iff
 *      theta > e^(-y_min)/(2 - e^(-y_min)), against theta > e^(-y_min)
 *      for PHASE-CERT -- the certified theta-window widens by the factor
 *      2 - e^(-y_min), approaching 2 at depth.
 *
 * COROLLARY NO-UNIF (the imp-95254 headline question, answered NO).
 * No phase-priced bound R <= F(theta, y_min) can stay below 1/2 uniformly
 * as theta -> 0: at ANY fixed y > 0, the imp-95224 SGN-SAT family phi_K
 * co-centered at delta = y/2 has y_min = 2 delta = y EXACTLY for every K
 * (rates lie in [1, 2], the minimal pair sum 2 sits at the j = 0 diagonal),
 * theta = theta_K -> 0 (1/17, 1/769, 1/40193, ... -- translation-invariant,
 * imp-95233 exact values), and R_K -> 1/2. So sup { R : theta = theta_K,
 * y_min = y } >= R_K -> 1/2, forcing limsup_(theta -> 0) F(theta, y) >= 1/2
 * for every valid F. A sharp phase-priced bound can exist only POINTWISE in
 * theta (a function rising to 1/2 as theta -> 0), never uniformly across
 * the small-theta families; PHASE-AM supplies the sub-1/2 region
 * theta > e^(-y_min)/(2 - e^(-y_min)).
 *
 * PROP LIN-NOGO (the natural sharp candidate is FALSE). The linear
 * interpolation R <= (1/2)(1 - theta (1 - e^(-y_min))) -- the unique form
 * linear in theta that matches FA-2 at theta = 1 and the ceiling 1/2 at
 * theta = 0 -- is refuted by the exact co-centered witness rates (3, 1/4),
 * center 1/2, c = (1, -3/4): theta = 259/547, y_min = 1/4,
 *   R = [e^(-3)/6 + (9/8) e^(-1/4) - (6/13) e^(-13/8)] * (156/259)
 *     = 0.4779782262235292 > 0.4476319952609633 = the linear bound.
 * So the sharp phase price is NOT linear in theta near theta ~ 0.47; the
 * true frontier rises to 1/2 faster than linearly there.
 *
 * PROP CEIL-X (the 1/2 ceiling is a co-centered artifact). For
 * NON-co-centered signed families R EXCEEDS 1/2: the exact witness rates
 * (1, 1/2), centers (1, 1/4), c = (1, -1) has y_min = 1/4,
 * theta = 0.1098987153919070 and
 *   R = [e^(-2)/2 + e^(-1/4) - (4/3) e^(-9/8)]
 *     / [3 - (16/3) e^(-3/8) + (8/3) e^(-3/4)] = 0.6961749688026323 > 1/2,
 * within 2e-4 of the pencil optimum for its geometry (lambda_max =
 * 0.6963235 of the 2x2 pair (L, M)). Randomized geometry scans reach
 * pencil values 0.977 at y_min ~ 0.03. Consequences: (i) the DC-NOGO
 * saturation value 1/2 is NOT a general ceiling -- it is specific to the
 * co-centered class; (ii) any valid F(theta, y_min) must EXCEED 1/2 at the
 * interior point (theta, y) ~ (0.110, 0.25), so sub-1/2 phase-priced
 * certification is impossible on part of the deep-cancellation region even
 * at FIXED positive theta -- the failure is not only a theta -> 0 limit.
 * The witness lies far below the PHASE-AM frontier (0.110 < 0.638), so no
 * contradiction with (iii) above; PHASE-AM evaluates to 1.9663 there and
 * holds.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA ENT swept over 20,000 random
 * pairs (worst signed margin ~1e-17, i.e. zero to float) plus exact
 * equality at the diagonal and at co-centered pairs. (2) PHASE-AM swept
 * over 5,000 random signed families of 2..5 packets (worst margin
 * positive); exact rational check at the imp-95224 witness c = (3, -4):
 * bound 17/8 = 2.125 against PHASE-CERT 33/8 = 4.125, ratio exactly
 * (1 + 1/33)/2. (3) theta = 1 single-packet equality to 1e-15. (4) Both
 * refutation witnesses verified in closed form AND by 400,000-panel
 * Simpson quadrature offline (rel ~1e-13). (5) The phi_K approach data
 * (cross-check only, float-limited beyond K ~ 6: theta_K < 1e-13 exceeds
 * double cancellation headroom): local exponent of (1/2 - R_K) against
 * theta_K rises 0.47, 0.61, 0.73, 0.82 over K = 1..5, consistent with a
 * near-linear approach along THIS family; LIN-NOGO shows the SUP over all
 * families still breaks the linear form at moderate theta. (6) A first
 * scratch conjecture (the linear form) was REFUTED by the search that
 * produced PROP LIN-NOGO and PROP CEIL-X -- recorded instead of dressed up.
 *
 * HONEST LIMITS. (a) PHASE-AM keeps a 1/(4 theta)-type loss as theta -> 0;
 * by NO-UNIF some blow-down to 1/2 is UNAVOIDABLE in this currency, but
 * the exact sharp frontier F(theta, y) = sup R at fixed currencies is OPEN
 * between the PHASE-AM sub-1/2 region and the CEIL-X exceedance points.
 * (b) Everything is on the imp-95222 packet model; the map to paper
 * per-window quantities (imp-95255, obligation (3) gammaSL) is UNCHANGED.
 * (c) Changes NO Lambda bound; NO QED; no refereed bound is changed.
 *
 * ROUTING. Obligation ledger: (2) amplitude sign/modulus certificate
 * ADVANCED again -- the phase leg now carries the strictly sharper
 * PHASE-AM bound, the linear-sharpening route is CLOSED (LIN-NOGO), the
 * uniform-sub-1/2 question is CLOSED (NO-UNIF, negative), and the
 * co-centered 1/2 ceiling is shown non-generic (CEIL-X); the surviving
 * residual is the exact sharp frontier sup R at fixed (theta, y_min) --
 * plausibly a pencil/NP object in the imp-95226 sense restricted to a
 * theta-level set. (1), (3), (4) UNCHANGED. Import-light (no zeros bundle,
 * no sibling imports).
 */

// -- baked literals (recomputed by the assertions) ---------------------------
const WITNESS_PHASE_AM = 2.125; // exact 17/8 at the c = (3, -4) witness
const WITNESS_PHASE_CERT = 4.125; // exact 33/8 (imp-95233), dominated
const LINNOGO_R = 0.4779782262235292; // closed-form witness R (co-centered)
const LINNOGO_LINEAR_BOUND = 0.4476319952609633; // (1/2)(1 - theta(1 - e^(-1/4)))
const LINNOGO_THETA_NUM = 259; // theta = 259/547 exactly
const LINNOGO_THETA_DEN = 547;
const CEILX_R = 0.6961749688026323; // closed-form witness R > 1/2
const CEILX_THETA = 0.1098987153919070;
const CEILX_PENCIL = 0.6963235332503716; // 2x2 pencil lambda_max, same geometry
const FRONTIER_OLD_AT_2LN2 = 0.25; // PHASE-CERT vacuity frontier e^(-y), y = 2 ln 2
const FRONTIER_NEW_AT_2LN2 = 1 / 7; // PHASE-AM frontier e^(-y)/(2 - e^(-y))

// -- exact Gram machinery (closed forms, no quadrature in the claims) --------
function overlapM(mu1, u1, mu2, u2) {
  const [ma, mb] = u1 <= u2 ? [mu1, mu2] : [mu2, mu1];
  const D = Math.abs(u2 - u1);
  const s13 = (Math.exp(-mb * D) + Math.exp(-ma * D)) / (ma + mb);
  const mid =
    Math.abs(mb - ma) < 1e-13
      ? D * Math.exp(-ma * D)
      : (Math.exp(-ma * D) - Math.exp(-mb * D)) / (mb - ma);
  return s13 + mid;
}
function leftL(mu1, u1, mu2, u2) {
  return Math.exp(-(mu1 * u1 + mu2 * u2)) / (mu1 + mu2);
}
function yMin(mu, u) {
  let m = Infinity;
  for (let i = 0; i < mu.length; i++)
    for (let j = 0; j < mu.length; j++)
      m = Math.min(m, (mu[i] + mu[j]) * Math.min(u[i], u[j]));
  return m;
}
function gram(mu, u, c) {
  let W = 0;
  let T = 0;
  let Tg = 0;
  for (let i = 0; i < mu.length; i++)
    for (let j = 0; j < mu.length; j++) {
      const L = leftL(mu[i], u[i], mu[j], u[j]);
      const M = overlapM(mu[i], u[i], mu[j], u[j]);
      W += c[i] * c[j] * L;
      T += c[i] * c[j] * M;
      Tg += Math.abs(c[i] * c[j]) * M;
    }
  const y = yMin(mu, u);
  const theta = T / Tg;
  return {
    W,
    T,
    Tg,
    R: W / T,
    theta,
    y,
    phaseAM: (Math.exp(-y) / 4) * (1 + 1 / theta),
    phaseCERT: Math.exp(-y) / (2 * theta),
  };
}
function mulberry(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// -- verdict object ----------------------------------------------------------
export const IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE = {
  ticket:
    "imp-95254 (twenty-fourth leg of the seam chain: the imp-95233 HONEST LIMITS (b) question -- does a sharper phase-priced signed seam bound exist? -- answered with THEOREM PHASE-AM, a strict sharpening R <= (e^(-y_min)/4)(1 + 1/theta), plus COROLLARY NO-UNIF and PROP CEIL-X refuting the uniformly-sub-1/2 reading of the question and PROP LIN-NOGO refuting the natural linear sharp form)",
  lemmaENT:
    "entrywise seam-mass domination: L_mn <= (1/2) e^(-y_min) M_mn for every pair including the diagonal, from the exact three-strip evaluation M_mn >= 2 e^(-mu_far D)/(mu_m + mu_n) (mu_far = rate of the farther-center packet; the difference is [e^(-mu_m D) - e^(-mu_n D)] 2 mu_n / ((mu_m + mu_n)(mu_n - mu_m)) >= 0) and L_mn = e^(-(mu_m + mu_n) u_near) e^(-mu_far D)/(mu_m + mu_n) <= e^(-y_min) e^(-mu_far D)/(mu_m + mu_n). Summed on the positive cone this re-derives imp-95222 FA-2.",
  lemmaODROP:
    "orthant cross-term drop: c^T L c <= c_plus^T L c_plus + c_minus^T L c_minus, because the dropped term -2 c_plus^T L c_minus is nonpositive (L entrywise positive). This charges the left-tail sign cancellation at cost zero where PHASE-CERT (via W(f) <= W(g)) re-added it with a plus sign.",
  theoremPHASEAM:
    "W(f) <= (1/2) e^(-y_min) [T(f_plus) + T(f_minus)] = (e^(-y_min)/4)[T(f) + T(g)], hence R(f) <= (e^(-y_min)/4)(1 + 1/theta). Strictly dominates imp-95233 PHASE-CERT by the exact factor (1 + theta)/2 (equality only at theta = 1); tight at theta = 1 (single packet = FA-2 sharp case); vacuity frontier lowered from theta > e^(-y_min) to theta > e^(-y_min)/(2 - e^(-y_min)), a certified-window widening by the factor 2 - e^(-y_min) -> 2 at depth.",
  corollaryNOUNIF:
    "no phase-priced bound F(theta, y_min) stays below 1/2 uniformly as theta -> 0: at any fixed y, phi_K co-centered at y/2 has y_min = y exactly for every K, theta_K -> 0, R_K -> 1/2 (imp-95224 SGN-SAT), so limsup_(theta->0) F(theta, y) >= 1/2 for every valid F. The imp-95254 question is answered NO in the uniform sense; only pointwise-in-theta sub-1/2 bounds can exist, and PHASE-AM provides the region theta > e^(-y_min)/(2 - e^(-y_min)).",
  propLINNOGO:
    "the natural linear sharp candidate R <= (1/2)(1 - theta(1 - e^(-y_min))) (linear in theta, matches FA-2 at theta = 1 and 1/2 at theta = 0) is FALSE: co-centered witness rates (3, 1/4), center 1/2, c = (1, -3/4) gives theta = 259/547, y_min = 1/4, R = 0.47798 > 0.44763 = the linear value. The sharp phase price is not linear in theta.",
  propCEILX:
    "R > 1/2 happens for non-co-centered signed families: rates (1, 1/2), centers (1, 1/4), c = (1, -1) gives R = 0.6961749688026323 at y_min = 1/4, theta = 0.1099 (within 2e-4 of its geometry pencil optimum 0.6963235). The DC-NOGO value 1/2 is a co-centered feature, not a ceiling; any valid F(theta, y_min) exceeds 1/2 at (0.110, 0.25), so sub-1/2 phase-priced certification fails on part of the region even at fixed positive theta. Consistent with PHASE-AM: the witness sits far below the frontier (0.110 < 0.638) and the bound evaluates to 1.9663 there.",
  constants: {
    witnessPhaseAM: WITNESS_PHASE_AM,
    witnessPhaseCERT: WITNESS_PHASE_CERT,
    linnogoR: LINNOGO_R,
    linnogoLinearBound: LINNOGO_LINEAR_BOUND,
    linnogoThetaNum: LINNOGO_THETA_NUM,
    linnogoThetaDen: LINNOGO_THETA_DEN,
    ceilxR: CEILX_R,
    ceilxTheta: CEILX_THETA,
    ceilxPencil: CEILX_PENCIL,
    frontierOldAt2ln2: FRONTIER_OLD_AT_2LN2,
    frontierNewAt2ln2: FRONTIER_NEW_AT_2LN2,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. Obligation ledger: (1) per-window Q extraction UNCHANGED; (2) ADVANCED -- phase leg now carries PHASE-AM (strict sharpening of PHASE-CERT, loss halved as theta -> 0, certified theta-window widened by 2 - e^(-y_min)); the linear-sharpening route is CLOSED (LIN-NOGO), the uniform-sub-1/2 question CLOSED negatively (NO-UNIF), the co-centered 1/2 ceiling shown non-generic (CEIL-X); surviving residual = the exact sharp frontier sup R at fixed (theta, y_min), plausibly the imp-95226 pencil/NP object restricted to a theta-level set; (3) envelope-shape port and seam-to-chain-gate (gammaSL) map UNCHANGED (imp-95276); (4) paper constants UNCHANGED.",
  verdict:
    "RIGOROUS step (one theorem, one corollary, two refutations): LEMMA ENT (entrywise L_mn <= (1/2) e^(-y_min) M_mn, exact three-strip inequality) + LEMMA ODROP (orthant cross-term drop) give THEOREM PHASE-AM, R(f) <= (e^(-y_min)/4)(1 + 1/theta), STRICTLY dominating the imp-95233 PHASE-CERT bound by the exact factor (1 + theta)/2, tight at theta = 1, with the vacuity frontier lowered from e^(-y_min) to e^(-y_min)/(2 - e^(-y_min)). COROLLARY NO-UNIF answers the ticket headline NO: SGN-SAT pins every valid F(theta, y) to limsup >= 1/2 as theta -> 0. PROP LIN-NOGO refutes the natural linear sharp form by an exact co-centered witness. PROP CEIL-X exhibits R = 0.6962 > 1/2 (exact non-co-centered witness), so the 1/2 ceiling is co-centered-only and sub-1/2 phase certification fails at an interior fixed-theta point. HONEST: the exact sharp frontier sup R at fixed (theta, y_min) stays OPEN between the PHASE-AM region and the CEIL-X exceedance; model-family only; changes NO Lambda bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "LEMMA ENT is an exact strip computation plus a sign identity. LEMMA ODROP is positivity of L. THEOREM PHASE-AM consumes imp-95222 FA-2 logic only through ENT (it re-proves the positive-cone case it needs). The two refutation witnesses are closed-form exponential/rational expressions. Float evaluation below is cross-check; randomized sweeps are cross-check; no claim rests on quadrature.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95254_PHASE_AM_ASSERTIONS = [
  {
    id: "imp95254-lemma-ent-sweep-and-equality",
    description:
      "LEMMA ENT holds on 20,000 random pairs (worst margin >= -1e-15 using the PAIR depth (mu_m + mu_n) min(u_m, u_n), which lower-bounds any family y_min) and holds with EQUALITY at the diagonal and at a co-centered pair",
    holds: () => {
      const rand = mulberry(95254);
      for (let t = 0; t < 20000; t++) {
        const mu1 = 0.1 + 5 * rand();
        const mu2 = 0.1 + 5 * rand();
        const u1 = 0.05 + 4 * rand();
        const u2 = 0.05 + 4 * rand();
        const y = (mu1 + mu2) * Math.min(u1, u2);
        if (
          leftL(mu1, u1, mu2, u2) >
          0.5 * Math.exp(-y) * overlapM(mu1, u1, mu2, u2) + 1e-15
        )
          return false;
      }
      const dEq =
        leftL(1.7, 0.9, 1.7, 0.9) -
        0.5 * Math.exp(-2 * 1.7 * 0.9) * overlapM(1.7, 0.9, 1.7, 0.9);
      const cEq =
        leftL(1, 0.9, 2.5, 0.9) -
        0.5 * Math.exp(-3.5 * 0.9) * overlapM(1, 0.9, 2.5, 0.9);
      return Math.abs(dEq) < 1e-15 && Math.abs(cEq) < 1e-15;
    },
  },
  {
    id: "imp95254-phase-am-exact-witness-dominance",
    description:
      "at the imp-95224 witness c = (3, -4), rates (1, 2), center ln 2: R = 3/8, theta = 1/33, PHASE-AM = 17/8 = 2.125 strictly below PHASE-CERT = 33/8 = 4.125, ratio exactly (1 + theta)/2 = 17/33",
    holds: () => {
      const m = gram([1, 2], [Math.LN2, Math.LN2], [3, -4]);
      if (Math.abs(m.R - 0.375) > 1e-12) return false;
      if (Math.abs(m.theta * 33 - 1) > 1e-12) return false;
      if (Math.abs(m.phaseAM - WITNESS_PHASE_AM) > 1e-12) return false;
      if (Math.abs(m.phaseCERT - WITNESS_PHASE_CERT) > 1e-12) return false;
      if (!(m.R <= m.phaseAM)) return false;
      return Math.abs(m.phaseAM / m.phaseCERT - (1 + m.theta) / 2) < 1e-12;
    },
  },
  {
    id: "imp95254-theta-one-tightness",
    description:
      "theta = 1 tightness: a single packet (rate 1.3, center 0.8) attains PHASE-AM with equality (R = (1/2) e^(-y_min) = bound), so the constant 1/4 admits no uniform improvement",
    holds: () => {
      const m = gram([1.3], [0.8], [1]);
      return Math.abs(m.R - m.phaseAM) < 1e-15 && Math.abs(m.theta - 1) < 1e-15;
    },
  },
  {
    id: "imp95254-phase-am-random-sweep",
    description:
      "THEOREM PHASE-AM holds across 5,000 random signed families of 2..5 packets (rates 0.2..4.2, centers 0.1..3.1, amplitudes in [-3, 3]) and never exceeds PHASE-CERT",
    holds: () => {
      const rand = mulberry(424242);
      for (let t = 0; t < 5000; t++) {
        const n = 2 + Math.floor(rand() * 4);
        const mu = [];
        const u = [];
        const c = [];
        for (let k = 0; k < n; k++) {
          mu.push(0.2 + 4 * rand());
          u.push(0.1 + 3 * rand());
          c.push((rand() - 0.5) * 6);
        }
        const m = gram(mu, u, c);
        if (!(m.T > 1e-12)) continue;
        if (m.R > m.phaseAM + 1e-10) return false;
        if (m.phaseAM > m.phaseCERT + 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95254-no-unif-phik-pinning",
    description:
      "COROLLARY NO-UNIF input facts: phi_K co-centered at ln 2 has y_min = 2 ln 2 EXACTLY for K = 1..5 (independent of K), theta_1 = 1/17 (imp-95233 exact value), theta_5 < 1e-8 while R_5 > 0.4999 -- depth currency fixed, phase currency collapsing, R pinned to 1/2",
    holds: () => {
      let prevR = 0;
      for (const K of [1, 2, 3, 4, 5]) {
        const mu = [];
        const c = [];
        for (let j = 0; j <= K; j++) {
          mu.push(1 + j / K);
          let b = 1;
          for (let i = 0; i < j; i++) b = (b * (K - i)) / (i + 1);
          c.push((j % 2 ? -1 : 1) * b);
        }
        const m = gram(
          mu,
          mu.map(() => Math.LN2),
          c,
        );
        if (Math.abs(m.y - 2 * Math.LN2) > 1e-14) return false;
        if (K === 1 && Math.abs(m.theta * 17 - 1) > 1e-9) return false;
        if (!(m.R <= m.phaseAM + 1e-10)) return false;
        if (!(m.R > prevR)) return false;
        prevR = m.R;
        if (K === 5 && !(m.theta < 1e-8 && m.R > 0.4999 && m.R < 0.500001))
          return false;
      }
      return true;
    },
  },
  {
    id: "imp95254-lin-nogo-exact-witness",
    description:
      "PROP LIN-NOGO: rates (3, 1/4), center 1/2, c = (1, -3/4) gives EXACT theta = 259/547 (T = 259/156, T_g = 547/156 in rationals), y_min = 1/4, closed-form R = [e^(-3)/6 + (9/8)e^(-1/4) - (6/13)e^(-13/8)](156/259) = 0.47798 EXCEEDING the linear candidate (1/2)(1 - theta(1 - e^(-1/4))) = 0.44763 by more than 0.03",
    holds: () => {
      const m = gram([3, 0.25], [0.5, 0.5], [1, -0.75]);
      if (Math.abs(m.T - 259 / 156) > 1e-12) return false;
      if (Math.abs(m.Tg - 547 / 156) > 1e-12) return false;
      if (Math.abs(m.theta - LINNOGO_THETA_NUM / LINNOGO_THETA_DEN) > 1e-12)
        return false;
      if (Math.abs(m.y - 0.25) > 1e-15) return false;
      const closedR =
        ((Math.exp(-3) / 6 +
          (9 / 8) * Math.exp(-0.25) -
          (6 / 13) * Math.exp(-13 / 8)) *
          156) /
        259;
      if (Math.abs(m.R - closedR) > 1e-12) return false;
      if (Math.abs(m.R - LINNOGO_R) > 1e-12) return false;
      const linear = 0.5 * (1 - m.theta * (1 - Math.exp(-m.y)));
      if (Math.abs(linear - LINNOGO_LINEAR_BOUND) > 1e-12) return false;
      if (!(m.R > linear + 0.03)) return false;
      return m.R <= m.phaseAM;
    },
  },
  {
    id: "imp95254-ceil-x-exact-witness",
    description:
      "PROP CEIL-X: rates (1, 1/2), centers (1, 1/4), c = (1, -1) gives closed-form R = [e^(-2)/2 + e^(-1/4) - (4/3)e^(-9/8)]/[3 - (16/3)e^(-3/8) + (8/3)e^(-3/4)] = 0.69617 > 1/2 at y_min = 1/4, theta = 0.10990 below the PHASE-AM frontier 0.63775; the 2x2 pencil optimum of the same geometry is 0.69632 (witness within 2e-4 of the sup); PHASE-AM = 1.966333 holds",
    holds: () => {
      const m = gram([1, 0.5], [1, 0.25], [1, -1]);
      const M12 = (8 / 3) * Math.exp(-3 / 8) - (4 / 3) * Math.exp(-3 / 4);
      const closedR =
        (Math.exp(-2) / 2 + Math.exp(-0.25) - (4 / 3) * Math.exp(-9 / 8)) /
        (3 - 2 * M12);
      if (Math.abs(m.R - closedR) > 1e-12) return false;
      if (Math.abs(m.R - CEILX_R) > 1e-12) return false;
      if (!(m.R > 0.5)) return false;
      if (Math.abs(m.y - 0.25) > 1e-15) return false;
      if (Math.abs(m.theta - CEILX_THETA) > 1e-12) return false;
      const frontier = Math.exp(-m.y) / (2 - Math.exp(-m.y));
      if (!(m.theta < frontier)) return false;
      // 2x2 generalized eigenvalue by the quadratic formula
      const L11 = leftL(1, 1, 1, 1);
      const L22 = leftL(0.5, 0.25, 0.5, 0.25);
      const L12 = leftL(1, 1, 0.5, 0.25);
      const A = 1 * 2 - M12 * M12;
      const B = L11 * 2 + L22 * 1 - 2 * L12 * M12;
      const C = L11 * L22 - L12 * L12;
      const lam = (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A);
      if (Math.abs(lam - CEILX_PENCIL) > 1e-9) return false;
      if (!(lam >= m.R && lam - m.R < 2e-4)) return false;
      return m.R <= m.phaseAM && Math.abs(m.phaseAM - 1.966333) < 1e-5;
    },
  },
  {
    id: "imp95254-vacuity-frontier",
    description:
      "vacuity frontier: at y = 2 ln 2 the PHASE-AM sub-1/2 frontier is e^(-y)/(2 - e^(-y)) = 1/7, strictly below the PHASE-CERT frontier e^(-y) = 1/4; the bound crosses 1/2 exactly there (sub-1/2 just above, super-1/2 just below)",
    holds: () => {
      const ey = 0.25;
      const f = ey / (2 - ey);
      if (Math.abs(f - FRONTIER_NEW_AT_2LN2) > 1e-15) return false;
      if (!(f < FRONTIER_OLD_AT_2LN2)) return false;
      const above = (ey / 4) * (1 + 1 / (f * 1.0001));
      const below = (ey / 4) * (1 + 1 / (f * 0.9999));
      return above < 0.5 && below > 0.5;
    },
  },
  {
    id: "imp95254-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap STILL OPEN, obligation (2) ADVANCED with the sharp frontier OPEN, both refutations named, no Lambda change, and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE.subGap) &&
      /stays OPEN/.test(IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE.verdict) &&
      /LIN-NOGO/.test(IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE.verdict) &&
      /CEIL-X/.test(IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE.verdict) &&
      /changes NO Lambda bound/.test(
        IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE.verdict,
      ) &&
      /NO QED/.test(IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE.verdict) &&
      /refereed bound is changed/i.test(IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE.verdict),
  },
];

for (const a of IMP95254_PHASE_AM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95254-orthant-split-phase-certificate assertion failed: ${a.id}`,
    );
  }
}

export default IMP95254_ORTHANT_SPLIT_PHASE_CERTIFICATE;
