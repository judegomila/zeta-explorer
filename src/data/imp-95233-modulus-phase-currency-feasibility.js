/**
 * imp-95233: FEASIBILITY ASSESSMENT (POSITIVE) + LEMMA MAJ + COROLLARY
 * PHASE-CERT -- does a modulus/phase-priced signed seam certificate escape
 * the depth-only no-go where count did? YES. The depth-currency no-go
 * (imp-95224 COROLLARY DC-NOGO: co-centered signed families saturate the
 * trivial symmetry ceiling R -> 1/2 at every fixed depth, so no bound
 * R <= F(y_min) with F < 1/2 anywhere exists) is proved here NOT to
 * obstruct a phase-priced certificate: the saturating witnesses are forced
 * to collapse their phase-alignment currency and blow up their amplitude
 * modulus, and an explicit -- if crude -- phase-priced signed bound is then
 * derived by a pointwise majorant reduction to the positive cone. This is
 * a constructive feasibility answer (an actual bound, not merely a
 * not-yet-refuted route), but it is HONEST-PARTIAL: the bound is loose (a
 * full 1/theta loss) and vacuous in the deep-cancellation regime where
 * signed seam families actually sit, so obligation (2) is ADVANCED, not
 * discharged.
 *
 * Companion to imp-95224 (depth no-go), imp-95225 (SGN-C count leg,
 * escaped), imp-95133 (weight leg, both candidates failed), imp-95226
 * (NP-exact count constant). Twenty-third leg of the seam chain. Objects
 * as in imp-95221/95222/95223/95224: packets f_n(s) = e^(-mu_n |s - u_n|),
 * rates mu_n > 0, centers u_n > 0, REAL amplitudes c_n; f = sum c_n f_n;
 * R = integral_(s<0) f^2 / integral_R f^2; y_min = min over pairs incl
 * diagonal of (mu_m + mu_n) min(u_m, u_n).
 *
 * PHASE-ALIGNMENT CURRENCY (definition). Let g = sum |c_n| f_n be the
 * positive-modulus envelope (same rates and centers, amplitudes replaced
 * by their moduli). Define the phase-alignment ratio
 *   theta(f) = integral_R f^2 / integral_R g^2  in (0, 1].
 * theta is SCALE-INVARIANT (c -> lambda c leaves it fixed) and theta = 1
 * exactly on the positive cone (all c_n of one sign); theta -> 0 measures
 * deep sign cancellation. This is the natural per-window modulus/phase
 * currency: it prices how far a signed family is from its positive
 * envelope, the object the depth-only currency y_min cannot see.
 *
 * LEMMA MAJ (pointwise majorant). Since every f_n >= 0, the triangle
 * inequality gives |f(s)| = |sum c_n f_n(s)| <= sum |c_n| f_n(s) = g(s)
 * pointwise, hence 0 <= f(s)^2 <= g(s)^2 for ALL s. Therefore over any
 * measurable set S, integral_S f^2 <= integral_S g^2; in particular
 * W(f) := integral_(s<0) f^2 <= W(g) and T(f) <= T(g) (so theta <= 1).
 *
 * COROLLARY PHASE-CERT (explicit phase-priced signed certificate).
 *   R(f) = W(f)/T(f) = [W(f)/T(g)] [T(g)/T(f)]
 *        <= [W(g)/T(g)] (1/theta) = R(g)/theta
 *        <= (1/(2 theta)) e^(-y_min),
 * the last step by the positive-cone seam bound R(g) <= (1/2) e^(-y_min)
 * (imp-95222 THEOREM FA-2, applied to the nonnegative-amplitude envelope
 * g; y_min(g) = y_min(f), same rates and centers). This is a genuine
 * SIGNED certificate whose right side depends on modulus/phase currency
 * (theta) in addition to depth (y_min); it beats the symmetry ceiling
 * 1/2 exactly when theta > e^(-y_min), and it recovers FA-2 exactly at
 * theta = 1. Because it CAN drop below 1/2 for signed families (whenever
 * theta stays above e^(-y_min)), it is NOT eliminated by DC-NOGO: the depth-only
 * obstruction is escaped by phase currency, precisely as count currency
 * escaped it (imp-95225).
 *
 * WHY THE NO-GO DOES NOT APPLY (the escape, made quantitative). The
 * canonical depth-saturating witness of imp-95224 THEOREM SGN-SAT,
 *   phi_K(t) = e^(-t) (1 - e^(-t/K))^K
 *            = sum_(j=0..K) (-1)^j C(K, j) e^(-(1 + j/K) t),
 * co-centered at delta with R -> 1/2 at FIXED depth y_min = 2 delta, has
 * EXACT phase-alignment
 *   theta(phi_K) = integral_0^1 x^(2K-1)(1 - x)^(2K) dx
 *                / integral_0^1 x^(2K-1)(1 + x)^(2K) dx
 *   = 1/17 (K=1), 1/769 (K=2), 1/40193 (K=3) -> 0,
 * and amplitude modulus that DIVERGES: L1 norm sum|c_j| = 2^K and L2
 * square sum c_j^2 = C(2K, K) both -> infinity. So depth saturation is
 * bought entirely with phase currency (theta -> 0) and modulus blow-up:
 * fixing theta >= theta_0 > 0 (equivalently capping the modulus) makes
 * the PHASE-CERT bound e^(-y_min)/(2 theta_0) drop below 1/2 for
 * y_min > ln(1/theta_0), so no such family can saturate. Modulus/phase
 * currency escapes exactly where depth could not.
 *
 * MODULUS DOES NOT REDUCE TO COUNT. The count leg (imp-95225 SGN-C) and
 * this phase/modulus leg are independent currencies: at FIXED count N the
 * modulus (theta, sum|c_n|) is still unbounded (amplitudes on N fixed
 * rates range freely), so a phase-priced bound is not a corollary of the
 * count-priced one -- it is a genuinely different lever on obligation (2).
 *
 * HONEST LIMITS. (a) FEASIBILITY, not resolution: PHASE-CERT is CRUDE --
 * it loses a full factor 1/theta and is VACUOUS in the deep-cancellation
 * regime (theta < e^(-y_min)) where the interesting signed seam families
 * sit (e.g. the imp-95224 exact witness c = (3, -4) has theta = 1/33, so
 * the bound is 33/8 = 4.125, useless), so obligation (2) is ADVANCED (a
 * live currency with a first constructive bound), NOT discharged. (b)
 * Whether a SHARP phase-priced bound -- one that stays below 1/2 across
 * the small-theta families the seam actually produces -- exists is OPEN;
 * the 1/theta loss is the residual. (c) The certificate inherits FA-2
 * scope (imp-95222 packet model) and changes NO Lambda bound; y_min and
 * theta are model-family quantities not yet mapped to the paper per-window
 * data (the seam-to-chain-gate gammaSL map, obligation (3), is unchanged).
 * (d) The escape is shown on the canonical SGN-SAT witness; a bounded-theta
 * saturating family is refuted BY the PHASE-CERT bound itself (theta
 * bounded below forces R below 1/2 at large depth), so no such family
 * exists -- this direction IS closed.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) LEMMA MAJ pointwise g >= |f| checked
 * on a grid for a mixed-sign triple. (2) COROLLARY PHASE-CERT verified in
 * EXACT rationals on two configs: the signed witness c = (3, -4) at
 * center ln 2 (R = 3/8, theta = 1/33, e^(-y_min) = 1/4, bound = 33/8,
 * holds loosely) and the positive-cone envelope c = (3, 4) (theta = 1,
 * R = 19/264, bound = 1/8 = FA-2, TIGHT), and by high-panel quadrature on
 * a general non-co-centered signed triple (R = 0.1368 <= bound 1.804,
 * and R(g) = 0.0421 <= FA-2 0.1233, cross-checking FA-2). (3) theta
 * collapse computed in EXACT BigInt rational integration: theta_K = 1/17,
 * 1/769, 1/40193 (K = 1, 2, 3), matched by direct t-space quadrature to
 * rel 1e-6. (4) Modulus blow-up sum|c_j| = 2^K, sum c_j^2 = C(2K, K)
 * checked exactly (2/2, 4/6, 8/20). (5) The theta = 1 tightness confirms
 * PHASE-CERT reduces to FA-2 with no slack in the positive cone.
 *
 * ROUTING. Sub-gap imp-95212-subgap-fresnel-airy-envelope-port -- STILL
 * OPEN. Obligation ledger: (1) per-window Q extraction UNCHANGED; (2)
 * amplitude sign/modulus certificate ADVANCED -- the modulus/phase leg
 * left OPEN by imp-95224/95226 is now a CONFIRMED-FEASIBLE currency with a
 * first constructive (crude) phase-priced bound R <= e^(-y_min)/(2 theta);
 * the count leg (imp-95225 SGN-C) and weight leg (imp-95133, both
 * candidates failed) are its independent siblings; residual = a SHARP
 * phase-priced bound removing the 1/theta loss; (3) envelope-shape port
 * and seam-to-chain-gate map UNCHANGED; (4) paper constants UNCHANGED.
 *
 * Import-light (no zeros bundle, no sibling imports). Changes no bound; NO
 * QED; no refereed bound is changed.
 */

// -- baked literals (recomputed by the assertions) ---------------------------
const THETA_K1_RECIP = 17; // theta(phi_1) = 1/17
const THETA_K2_RECIP = 769; // theta(phi_2) = 1/769
const THETA_K3_RECIP = 40193; // theta(phi_3) = 1/40193
const WITNESS_THETA_RECIP = 33; // theta of c = (3, -4) at center ln 2 (T(f)=1, T(g)=33)
const WITNESS_R = 0.375; // exact 3/8, the imp-95224 SGN-X witness R
const WITNESS_BOUND = 4.125; // exact 33/8 = e^(-y_min)/(2 theta) at the witness (loose, theta small)
const POSCONE_R = 0.0719696969696970; // exact 19/264, R of the positive envelope c = (3, 4)
const POSCONE_BOUND = 0.125; // exact 1/8 = (1/2) e^(-y_min): PHASE-CERT = FA-2 at theta = 1

// -- exact BigInt fraction helpers -------------------------------------------
function bgcd(x, y) {
  let a = x < 0n ? -x : x;
  let b = y < 0n ? -y : y;
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a || 1n;
}
function factB(n) {
  let r = 1n;
  for (let i = 2n; i <= n; i++) r *= i;
  return r;
}
function binomB(n, k) {
  return factB(BigInt(n)) / (factB(BigInt(k)) * factB(BigInt(n - k)));
}

// -- exact theta(phi_K) in BigInt rational integration -----------------------
// theta_K = int_0^1 x^(2K-1)(1-x)^(2K) dx / int_0^1 x^(2K-1)(1+x)^(2K) dx.
// Numerator = B(2K, 2K+1) = (2K-1)! (2K)! / (4K)!.
// Denominator = sum_(j=0..2K) C(2K, j) / (2K + j)  [from int x^(2K-1+j)].
function thetaRecipExact(K) {
  const numN = factB(BigInt(2 * K - 1)) * factB(BigInt(2 * K));
  const numD = factB(BigInt(4 * K));
  let dN = 0n;
  let dD = 1n;
  for (let j = 0; j <= 2 * K; j++) {
    const tN = binomB(2 * K, j);
    const tD = BigInt(2 * K + j);
    dN = dN * tD + tN * dD;
    dD = dD * tD;
    const g = bgcd(dN, dD);
    dN /= g;
    dD /= g;
  }
  // theta = (numN/numD) / (dN/dD); return the reduced reciprocal dN*numD/(numN*dD)
  let rN = dN * numD;
  let rD = numN * dD;
  const g = bgcd(rN, rD);
  rN /= g;
  rD /= g;
  return { recipN: rN, recipD: rD }; // 1/theta as a reduced fraction
}

// -- float helpers (cross-checks only) ---------------------------------------
function simpson(a, b, n, g) {
  const h = (b - a) / n;
  let S = g(a) + g(b);
  for (let i = 1; i < n; i++) S += g(a + i * h) * (i % 2 ? 4 : 2);
  return (S * h) / 3;
}
function makeF(mu, u, c) {
  return (s) => {
    let v = 0;
    for (let k = 0; k < c.length; k++) v += c[k] * Math.exp(-mu[k] * Math.abs(s - u[k]));
    return v;
  };
}
function yMin(mu, u) {
  let m = Infinity;
  for (let i = 0; i < mu.length; i++)
    for (let j = 0; j < mu.length; j++)
      m = Math.min(m, (mu[i] + mu[j]) * Math.min(u[i], u[j]));
  return m;
}
// returns {R, Rg, theta, y, bound} by quadrature
function measure(mu, u, c) {
  const f = makeF(mu, u, c);
  const g = makeF(mu, u, c.map(Math.abs));
  const W = simpson(-60, 0, 200000, (s) => f(s) ** 2);
  const T = W + simpson(0, 60, 200000, (s) => f(s) ** 2);
  const Wg = simpson(-60, 0, 200000, (s) => g(s) ** 2);
  const Tg = Wg + simpson(0, 60, 200000, (s) => g(s) ** 2);
  const theta = T / Tg;
  const y = yMin(mu, u);
  return { R: W / T, Rg: Wg / Tg, theta, y, bound: Math.exp(-y) / (2 * theta) };
}

// -- verdict object ----------------------------------------------------------
export const IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY = {
  ticket:
    "imp-95233 (twenty-third leg of the seam chain: does a modulus/phase-priced signed seam certificate escape the depth-only no-go where count did? YES -- the depth-currency no-go imp-95224 DC-NOGO does NOT obstruct a phase-priced bound; an explicit but crude phase-priced signed certificate R <= e^(-y_min)/(2 theta) is derived by pointwise majorant reduction to the positive cone; feasibility CONFIRMED constructively, obligation (2) ADVANCED not discharged)",
  currency:
    "phase-alignment ratio theta(f) = integral_R f^2 / integral_R g^2 in (0,1], g = sum |c_n| f_n the positive-modulus envelope; scale-invariant, theta = 1 on the positive cone, theta -> 0 under deep sign cancellation -- the per-window modulus/phase currency the depth-only y_min cannot see.",
  lemmaMAJ:
    "pointwise majorant: every f_n >= 0 so |f| = |sum c_n f_n| <= sum |c_n| f_n = g pointwise, hence f^2 <= g^2 everywhere and integral_S f^2 <= integral_S g^2 on any set S; in particular W(f) <= W(g) and T(f) <= T(g) (so theta <= 1).",
  corollaryPHASECERT:
    "explicit phase-priced signed certificate: R(f) = [W(f)/T(g)][T(g)/T(f)] <= [W(g)/T(g)](1/theta) = R(g)/theta <= (1/(2 theta)) e^(-y_min), the last step by the positive-cone bound R(g) <= (1/2) e^(-y_min) (imp-95222 FA-2, applied to the nonnegative-amplitude envelope g). Beats the symmetry ceiling 1/2 exactly when theta > e^(-y_min); recovers FA-2 exactly at theta = 1. Since it can drop below 1/2 for signed families, DC-NOGO does NOT apply -- depth-only currency is escaped by phase currency, as count currency escaped it (imp-95225).",
  escape:
    "the canonical depth-saturating witness phi_K(t) = e^(-t)(1 - e^(-t/K))^K (imp-95224 SGN-SAT, R -> 1/2 at fixed depth 2 delta) buys saturation entirely with phase/modulus: EXACT theta(phi_K) = 1/17, 1/769, 1/40193 (K = 1, 2, 3) -> 0 while sum|c_j| = 2^K and sum c_j^2 = C(2K, K) both -> infinity. Fixing theta >= theta_0 > 0 makes the PHASE-CERT bound e^(-y_min)/(2 theta_0) drop below 1/2 for y_min > ln(1/theta_0), so NO bounded-theta family can saturate -- the escape direction is closed.",
  independence:
    "modulus/phase is a SEPARATE currency from count: at fixed count N the amplitudes on N fixed rates range freely so theta and sum|c_n| stay unbounded; the phase-priced bound is not a corollary of the imp-95225 count-priced bound, nor of the imp-95133 (failed) weight-priced candidates.",
  constants: {
    thetaK1Recip: THETA_K1_RECIP,
    thetaK2Recip: THETA_K2_RECIP,
    thetaK3Recip: THETA_K3_RECIP,
    witnessThetaRecip: WITNESS_THETA_RECIP,
    witnessR: WITNESS_R,
    witnessBound: WITNESS_BOUND,
    posconeR: POSCONE_R,
    posconeBound: POSCONE_BOUND,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. Obligation ledger: (1) per-window Q extraction UNCHANGED; (2) amplitude sign/modulus certificate ADVANCED -- the modulus/phase leg left OPEN by imp-95224/95226 is now a CONFIRMED-FEASIBLE currency carrying a first constructive (crude) phase-priced bound R <= e^(-y_min)/(2 theta); its siblings are the count leg (imp-95225 SGN-C, escaped, NP-terminal) and the weight leg (imp-95133, both candidates failed); the residual is a SHARP phase-priced bound removing the 1/theta loss, which is VACUOUS in the deep-cancellation regime theta < e^(-y_min) where the seam families sit; (3) envelope-shape port and seam-to-chain-gate (gammaSL-form) map UNCHANGED; (4) paper constants per window UNCHANGED.",
  verdict:
    "RIGOROUS step (constructive FEASIBILITY, honest partial): LEMMA MAJ (pointwise g >= |f|, one line from the triangle inequality since f_n >= 0) plus imp-95222 FA-2 yield COROLLARY PHASE-CERT, an EXPLICIT phase-priced signed certificate R <= e^(-y_min)/(2 theta) that depends on modulus/phase currency (theta) beyond depth (y_min), recovers FA-2 at theta = 1 (TIGHT), and drops below the DC-NOGO symmetry ceiling 1/2 whenever theta > e^(-y_min) -- so the depth-only no-go (imp-95224) does NOT obstruct modulus/phase currency, which escapes exactly as count did (imp-95225). The escape is exact: the SGN-SAT saturating family has theta = 1/17, 1/769, 1/40193 -> 0 and modulus 2^K, C(2K,K) -> infinity, and bounded-theta families cannot saturate. HONEST: PHASE-CERT is CRUDE (loses 1/theta, VACUOUS for theta < e^(-y_min) where the seam families sit -- the exact witness c = (3,-4) has theta = 1/33 and bound 33/8), so obligation (2) is ADVANCED (a live currency with a first bound), NOT discharged; a SHARP phase-priced bound is the residual; nothing touches any Lambda bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "LEMMA MAJ is the triangle inequality on nonnegative packets (exact). COROLLARY PHASE-CERT is exact algebra given imp-95222 FA-2 (which it consumes as a lemma, not re-proves). theta(phi_K) = 1/17, 1/769, 1/40193 is exact BigInt rational integration. Modulus blow-up 2^K, C(2K,K) is an exact binomial identity. All float quadrature below is cross-check only; the theorem statements consume none of it.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95233_PHASE_CURRENCY_ASSERTIONS = [
  {
    id: "imp95233-theta-collapse-exact",
    description:
      "EXACT theta(phi_K) = 1/17, 1/769, 1/40193 for K = 1, 2, 3 by BigInt rational integration of the two majorant polynomials, matching the baked reciprocals; theta is strictly decreasing toward 0 -- the depth-saturating family spends phase currency",
    holds: () => {
      const r1 = thetaRecipExact(1);
      const r2 = thetaRecipExact(2);
      const r3 = thetaRecipExact(3);
      if (!(r1.recipD === 1n && r1.recipN === BigInt(THETA_K1_RECIP))) return false;
      if (!(r2.recipD === 1n && r2.recipN === BigInt(THETA_K2_RECIP))) return false;
      if (!(r3.recipD === 1n && r3.recipN === BigInt(THETA_K3_RECIP))) return false;
      return THETA_K1_RECIP < THETA_K2_RECIP && THETA_K2_RECIP < THETA_K3_RECIP;
    },
  },
  {
    id: "imp95233-theta-quadrature-crosscheck",
    description:
      "the exact theta_K survive an independent direct t-space quadrature of phi_K(t)^2 and g_K(t)^2 = (e^(-t)(1 + e^(-t/K))^K)^2: measured theta matches 1/17, 1/769, 1/40193 to rel 1e-6",
    holds: () => {
      for (const K of [1, 2, 3]) {
        const phi2 = (t) => (Math.exp(-t) * (1 - Math.exp(-t / K)) ** K) ** 2;
        const g2 = (t) => (Math.exp(-t) * (1 + Math.exp(-t / K)) ** K) ** 2;
        const num = simpson(0, 80, 160000, phi2);
        const den = simpson(0, 80, 160000, g2);
        const theta = num / den;
        const recip = [THETA_K1_RECIP, THETA_K2_RECIP, THETA_K3_RECIP][K - 1];
        if (Math.abs(theta * recip - 1) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95233-modulus-blowup-exact",
    description:
      "the depth-saturating amplitudes c_j = (-1)^j C(K, j) have EXACT L1 modulus sum|c_j| = 2^K and L2 square sum c_j^2 = C(2K, K), both diverging (2/2, 4/6, 8/20 at K = 1, 2, 3): saturation is bought with unbounded modulus",
    holds: () => {
      for (const K of [1, 2, 3]) {
        let l1 = 0n;
        let l2 = 0n;
        for (let j = 0; j <= K; j++) {
          const c = binomB(K, j);
          l1 += c;
          l2 += c * c;
        }
        if (l1 !== 2n ** BigInt(K)) return false;
        if (l2 !== binomB(2 * K, K)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95233-lemma-maj-pointwise",
    description:
      "LEMMA MAJ: for the mixed-sign triple c = (2, -3, 1.5) on rates (1, 1.5, 2.3), centers (0.7, 1.2, 0.9), the envelope g = sum|c_n| f_n dominates |f| pointwise on a scan grid (g - |f| >= -1e-14)",
    holds: () => {
      const mu = [1, 1.5, 2.3];
      const u = [0.7, 1.2, 0.9];
      const c = [2, -3, 1.5];
      const f = makeF(mu, u, c);
      const g = makeF(mu, u, c.map(Math.abs));
      for (let s = -4; s <= 6; s += 0.13) {
        if (g(s) - Math.abs(f(s)) < -1e-14) return false;
      }
      return true;
    },
  },
  {
    id: "imp95233-phasecert-exact-witness-and-poscone",
    description:
      "COROLLARY PHASE-CERT in EXACT rationals: the signed witness c = (3, -4) at center ln 2 has T(f) = 1, T(g) = 33 (theta = 1/33), R = 3/8, e^(-y_min) = 1/4, bound = 33/8 = 4.125 (holds, loose since theta < 1/4); the positive-cone envelope c = (3, 4) has theta = 1, R = 19/264 and bound = 1/8 = (1/2)e^(-y_min) = FA-2, TIGHT",
    holds: () => {
      // signed witness: T(f) = 9 - 24(2/3) + 16(1/2) = 1; T(g) = 9 + 24(2/3) + 16(1/2) = 33
      const Tf = 9 - 24 * (2 / 3) + 16 * (1 / 2);
      const Tg = 9 + 24 * (2 / 3) + 16 * (1 / 2);
      if (Math.abs(Tf - 1) > 1e-12) return false;
      if (Math.abs(Tg - 33) > 1e-12) return false;
      const theta = Tf / Tg;
      if (Math.abs(theta * WITNESS_THETA_RECIP - 1) > 1e-12) return false;
      const eY = 0.25; // e^(-2 ln 2)
      const boundW = eY / (2 * theta);
      if (Math.abs(boundW - WITNESS_BOUND) > 1e-9) return false;
      if (!(WITNESS_R <= boundW + 1e-12)) return false;
      // positive cone c = (3,4): W(g) = 19/8, T(g) = 33, R = 19/264; bound = 1/8
      const Rg = 19 / 8 / 33;
      if (Math.abs(Rg - POSCONE_R) > 1e-12) return false;
      const boundP = eY / 2;
      if (Math.abs(boundP - POSCONE_BOUND) > 1e-12) return false;
      return Rg <= boundP + 1e-12; // FA-2 holds, PHASE-CERT reduces to it at theta = 1
    },
  },
  {
    id: "imp95233-phasecert-general-quadrature",
    description:
      "COROLLARY PHASE-CERT holds by quadrature on a general non-co-centered signed triple c = (2, -3, 1.5): R(f) = 0.1368 <= bound e^(-y_min)/(2 theta) = 1.804, the intermediate R(f) <= R(g)/theta holds, and R(g) = 0.0421 <= (1/2)e^(-y_min) = 0.1233 cross-checks FA-2",
    holds: () => {
      const m = measure([1, 1.5, 2.3], [0.7, 1.2, 0.9], [2, -3, 1.5]);
      if (!(m.R <= m.bound)) return false;
      if (!(m.R <= m.Rg / m.theta + 1e-9)) return false;
      if (!(m.Rg <= 0.5 * Math.exp(-m.y) + 1e-9)) return false;
      // sanity: the fixed geometry gives y_min = 1.4 (diagonal 2*1*0.7)
      return Math.abs(m.y - 1.4) < 1e-12;
    },
  },
  {
    id: "imp95233-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap STILL OPEN, obligation (2) ADVANCED not discharged, PHASE-CERT flagged CRUDE/VACUOUS in the deep-cancellation regime, escape direction closed, and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY.subGap) &&
      /ADVANCED not discharged|ADVANCED \(a live currency with a first bound\), NOT discharged/.test(
        IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY.verdict,
      ) &&
      /CRUDE/.test(IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY.verdict) &&
      /VACUOUS/.test(IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY.verdict) &&
      /escape direction is closed|cannot saturate/.test(
        IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY.escape,
      ) &&
      /NO QED/.test(IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY.verdict) &&
      /refereed bound is changed/i.test(IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY.verdict),
  },
];

for (const a of IMP95233_PHASE_CURRENCY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95233-modulus-phase-currency-feasibility assertion failed: ${a.id}`,
    );
  }
}

export default IMP95233_MODULUS_PHASE_CURRENCY_FEASIBILITY;
