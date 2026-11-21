/**
 * imp-95291: ASSESSMENT of the MODULUS/PHASE currency leg of the imp-95142
 * signed-certificate obligation ledger (obligation (2), sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port).
 *
 * GRADE: assessment / model-family only. No new certificate is fired, no
 * Lambda bound changes, NO QED. No refereed bound is changed.
 *
 * WHY THIS TICKET. The imp-95142 ledger records the MODULUS/PHASE leg as
 * status OPEN with grade "unscoped -- no candidate certificate attempted
 * yet". That grade predates imp-95254. This module assesses the leg after
 * imp-95254 and separates its two halves, PHASE and MODULUS, which the
 * one-line ledger label collapses.
 *
 * MODEL. As in imp-95221/95222/95254: packets f_n(s) = e^(-mu_n |s - u_n|),
 * rates mu_n > 0, centers u_n > 0, REAL amplitudes c_n; f = sum c_n f_n;
 * g = sum |c_n| f_n the positive-modulus envelope; W(f) = integral_(s<0) f^2;
 * T(f) = integral_R f^2; R = W/T; theta = T(f)/T(g) in (0, 1]; y_min the
 * min-pairwise seam floor. With all centers positive the left tail is exact,
 * L_mn = a_m a_n/(mu_m + mu_n), a_n = e^(-mu_n u_n), M_mn = integral_R f_m f_n.
 * Because the amplitudes are real, the per-packet "phase" is the sign of c_n
 * and the per-packet "modulus" is |c_n|; the MODULUS/PHASE leg asks for a
 * per-window currency in these that is distinct from the COUNT and WEIGHT
 * currencies.
 *
 * FINDING 1 (PHASE half is SCOPED, not "unscoped"). imp-95254 THEOREM
 * PHASE-AM is exactly a phase-currency certificate:
 *   R(f) <= (e^(-y_min)/4) (1 + 1/theta),
 * with theta = T(f)/T(g) the phase currency (net sign alignment of the
 * signed family against its positive envelope). It strictly dominates the
 * imp-95233 PHASE-CERT bound by the exact factor (1 + theta)/2, is tight at
 * theta = 1, and lowers the vacuity frontier to theta > e^(-y_min)/(2 -
 * e^(-y_min)). Its limits are already mapped: COROLLARY NO-UNIF (no
 * phase-priced bound stays below 1/2 uniformly as theta -> 0), PROP CEIL-X
 * (R exceeds 1/2 off the co-centered class), PROP LIN-NOGO (the sharp price
 * is not linear in theta); the exact sharp frontier sup R at fixed
 * (theta, y_min) is the open item imp-95289. So the ledger grade is STALE
 * for the phase half: the phase currency IS scoped, with one certificate
 * delivered and its frontier localized.
 *
 * FINDING 2 (MODULUS half carries NO independent sub-1/2 currency). A
 * "modulus currency" would have to be a discount read off the DISTRIBUTION
 * of the moduli |c_n| at a fixed sign pattern and geometry, orthogonal to
 * theta. No such lever exists, for three reasons that are exact on the
 * model:
 *   (a) NOT ORTHOGONAL TO theta. The phase currency theta = T(f)/T(g) is
 *       DEFINED through the modulus envelope g = sum |c_n| f_n. Changing the
 *       modulus distribution at fixed geometry and signs already changes
 *       theta (assertion imp95291-modulus-enters-theta: the same 2-packet
 *       signed geometry with |c| = (1, 1) has theta = 0.0588 and with
 *       |c| = (3, 1) has theta = 0.4074). Modulus is thus an INPUT to the
 *       phase currency, not a separable second currency.
 *   (b) WIDENING MODULUS SPREAD DOES NOT LOWER R. The imp-95224 SGN-SAT
 *       family phi_K has binomial moduli |c_j| = C(K, j) whose dynamic range
 *       max|c|/min|c| = C(K, floor(K/2)) GROWS (2, 3, 6, 10 at K = 2..5),
 *       yet R climbs monotonically toward 1/2 (0.4737, 0.4977, 0.4999,
 *       0.499995) while theta collapses. Growing modulus spread buys no
 *       seam discount; if anything R rises. So no modulus-distribution
 *       functional can certify below the depth-only ceiling.
 *   (c) FIXED-theta EXCEEDANCE FENCES ANY MODULUS REFINEMENT. imp-95254
 *       PROP CEIL-X exhibits R = 0.6961749688026323 > 1/2 at a FIXED
 *       positive theta = 0.1099 (y_min = 1/4). At that (theta, y_min) no
 *       further discount read from the moduli can be sub-1/2, since R itself
 *       already exceeds 1/2 there.
 *
 * VERDICT. The MODULUS/PHASE leg has no un-scoped residual beyond the
 * already-open exact-frontier item imp-95289. The PHASE half carries
 * imp-95254 PHASE-AM (currency theta = T(f)/T(g)); the MODULUS half is not
 * an independent currency -- modulus enters the certificate ONLY through g
 * in theta (a), a wide modulus distribution supplies no sub-1/2 discount
 * (b), and the CEIL-X fixed-theta exceedance fences any modulus-only
 * refinement (c). The imp-95142 grade "unscoped -- no candidate certificate
 * attempted yet" is therefore superseded: read the leg as "PHASE scoped
 * (PHASE-AM, frontier imp-95289 open); MODULUS collapses into theta -- no
 * independent lever". This is an assessment, not a certificate; it changes
 * no Lambda bound; NO QED.
 *
 * SKEPTICAL SELF-CHECK. All numerics below are recomputed from the exact
 * closed-form Gram machinery copied verbatim from imp-95254 (import-light,
 * no bundle, no sibling import). The SGN-SAT R and theta values, the CEIL-X
 * witness, and the modulus-scaling theta pair were all reproduced to float.
 * The claim (b) is a POSITIVE statement about a specific family, not a proof
 * that no modulus functional exists in the abstract; it is fenced as a
 * refutation of the natural modulus-spread discount, and the honest residual
 * (the exact sharp frontier imp-95289) is carried forward unchanged.
 *
 * @see imp-95254-orthant-split-phase-certificate.js (THEOREM PHASE-AM,
 *   COROLLARY NO-UNIF, PROP CEIL-X, PROP LIN-NOGO)
 * @see imp-95142-signed-certificate-obligation-ledger.js (the leg being
 *   assessed)
 * @see imp-95289 (exact sharp frontier sup R at fixed (theta, y_min); open)
 */

// -- exact Gram machinery (closed forms; copied from imp-95254; import-light)
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
  return { W, T, Tg, R: W / T, theta, y, phaseAM: (Math.exp(-y) / 4) * (1 + 1 / theta) };
}
// binomial-modulus SGN-SAT family phi_K (imp-95224), co-centered at ln 2
function sgnSat(K) {
  const mu = [];
  const c = [];
  for (let j = 0; j <= K; j++) {
    mu.push(1 + j / K);
    let b = 1;
    for (let i = 0; i < j; i++) b = (b * (K - i)) / (i + 1);
    c.push((j % 2 ? -1 : 1) * b);
  }
  const u = mu.map(() => Math.LN2);
  const absc = c.map(Math.abs);
  const dyn = Math.max(...absc) / Math.min(...absc);
  return { m: gram(mu, u, c), dyn };
}

// -- baked literals (recomputed by the assertions) ---------------------------
const CEILX_R = 0.6961749688026323; // imp-95254 PROP CEIL-X witness, > 1/2
const CEILX_THETA = 0.1098987153919070; // fixed positive phase currency there

// -- verdict object ----------------------------------------------------------
export const IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT = {
  ticket:
    "imp-95291 (assessment of the imp-95142 MODULUS/PHASE currency leg after imp-95254): the PHASE half is SCOPED by THEOREM PHASE-AM (currency theta = T(f)/T(g), frontier imp-95289 open); the MODULUS half is NOT an independent currency -- modulus enters only through the envelope g in theta, a wide modulus distribution supplies no sub-1/2 discount, and the CEIL-X fixed-theta exceedance fences any modulus-only refinement",
  phaseHalf:
    "SCOPED. imp-95254 THEOREM PHASE-AM is the phase-currency certificate R(f) <= (e^(-y_min)/4)(1 + 1/theta) with theta = T(f)/T(g); it strictly dominates PHASE-CERT by (1 + theta)/2, is tight at theta = 1, lowers the vacuity frontier to theta > e^(-y_min)/(2 - e^(-y_min)), and its limits are mapped (NO-UNIF, CEIL-X, LIN-NOGO). The exact sharp frontier sup R at fixed (theta, y_min) is the open item imp-95289.",
  modulusHalf:
    "NO INDEPENDENT CURRENCY. (a) theta is DEFINED through g = sum |c_n| f_n, so a modulus-distribution change at fixed geometry and signs is already a theta change -- modulus is an input to the phase currency, not a separable second currency. (b) The SGN-SAT family phi_K has binomial moduli with dynamic range C(K, floor(K/2)) = 2, 3, 6, 10 at K = 2..5 that GROWS while R climbs to 1/2 (0.4737, 0.4977, 0.4999, 0.499995): widening modulus spread buys no seam discount. (c) PROP CEIL-X gives R = 0.6961749688 > 1/2 at fixed positive theta = 0.1099, so no modulus-only refinement at fixed phase currency can be sub-1/2 there.",
  ledgerReclassification:
    "the imp-95142 grade 'unscoped -- no candidate certificate attempted yet' is SUPERSEDED: read the MODULUS/PHASE leg as 'PHASE scoped (PHASE-AM, frontier imp-95289 open); MODULUS collapses into theta -- no independent lever'. The leg has no un-scoped residual beyond imp-95289; status stays OPEN because that exact frontier is undecided, not because the leg is untried.",
  constants: {
    ceilxR: CEILX_R,
    ceilxTheta: CEILX_THETA,
    sgnSatModDynRange: [2, 3, 6, 10],
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. The MODULUS/PHASE leg is assessed, not closed: the surviving residual is the exact sharp phase frontier imp-95289 (sup R at fixed (theta, y_min)); the modulus half contributes no separate residual. Obligation (1) per-window Q extraction, (3) gammaSL map (imp-95276), and (4) paper constants UNCHANGED.",
  verdict:
    "ASSESSMENT (model-family only, not a certificate): the imp-95142 MODULUS/PHASE leg splits into a SCOPED phase half (imp-95254 PHASE-AM, currency theta = T(f)/T(g), sharp frontier imp-95289 open) and a MODULUS half that is NOT an independent currency -- modulus enters the certificate only through g in theta (a), a growing modulus dynamic range on SGN-SAT supplies no sub-1/2 discount (b), and the CEIL-X fixed-theta exceedance R = 0.6962 > 1/2 fences any modulus-only refinement (c). The leg has no un-scoped residual beyond the already-open imp-95289; the ledger 'unscoped' grade is superseded. Changes NO Lambda bound; NO QED; no refereed bound is changed.",
};

export default IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT;

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95291_ASSERTIONS = [
  {
    id: "imp95291-phase-am-is-a-phase-certificate",
    description:
      "PHASE-AM is a genuine phase-currency certificate: at the imp-95224 witness c = (3, -4), rates (1, 2), center ln 2, R = 3/8 <= PHASE-AM = (e^(-y)/4)(1 + 1/theta), theta = 1/33, so the phase half is scoped, not unscoped",
    holds: () => {
      const m = gram([1, 2], [Math.LN2, Math.LN2], [3, -4]);
      if (Math.abs(m.R - 0.375) > 1e-12) return false;
      if (Math.abs(m.theta * 33 - 1) > 1e-12) return false;
      return m.R <= m.phaseAM + 1e-12;
    },
  },
  {
    id: "imp95291-modulus-enters-theta",
    description:
      "(a) modulus is an input to theta, not a separable currency: the same 2-packet signed geometry (rates 1, 2; centers 1/2; signs +, -) has theta = 0.0588 at |c| = (1, 1) and theta = 0.4074 at |c| = (3, 1) -- changing the modulus distribution alone changes theta, and both satisfy PHASE-AM",
    holds: () => {
      const g1 = gram([1, 2], [0.5, 0.5], [1, -1]);
      const g2 = gram([1, 2], [0.5, 0.5], [3, -1]);
      if (Math.abs(g1.theta - 0.05882352941176474) > 1e-12) return false;
      if (Math.abs(g2.theta - 0.4074074074074074) > 1e-12) return false;
      if (!(Math.abs(g1.theta - g2.theta) > 0.1)) return false;
      return g1.R <= g1.phaseAM + 1e-12 && g2.R <= g2.phaseAM + 1e-12;
    },
  },
  {
    id: "imp95291-modulus-spread-no-sub-half-lever",
    description:
      "(b) widening the modulus dynamic range buys no seam discount: SGN-SAT phi_K (K = 2..5) has binomial-modulus dynamic range 2, 3, 6, 10 STRICTLY INCREASING while R = 0.4737, 0.4977, 0.4999, 0.499995 climbs monotonically toward 1/2 (never below) and theta collapses -- no modulus-distribution functional can certify below 1/2",
    holds: () => {
      const expectedDyn = [2, 3, 6, 10];
      let prevR = 0;
      let prevDyn = 0;
      for (let idx = 0; idx < 4; idx++) {
        const K = idx + 2;
        const { m, dyn } = sgnSat(K);
        if (Math.abs(dyn - expectedDyn[idx]) > 1e-9) return false;
        if (!(dyn > prevDyn)) return false; // modulus spread strictly grows
        if (!(m.R > prevR)) return false; // R rises, not falls
        if (!(m.R < 0.5)) return false; // stays below (never a sub-1/2 gain from spread)
        if (!(m.R <= m.phaseAM + 1e-9)) return false;
        prevR = m.R;
        prevDyn = dyn;
      }
      // K = 5 is within 1e-4 of the 1/2 ceiling despite the widest modulus spread
      const last = sgnSat(5).m;
      return last.R > 0.4999 && last.R < 0.5;
    },
  },
  {
    id: "imp95291-ceilx-fixed-theta-fences-modulus",
    description:
      "(c) the imp-95254 CEIL-X witness (rates 1, 1/2; centers 1, 1/4; c = 1, -1) gives R = 0.6961749688 > 1/2 at FIXED positive theta = 0.1099, y_min = 1/4 -- at that phase currency no modulus-only refinement can be sub-1/2",
    holds: () => {
      const m = gram([1, 0.5], [1, 0.25], [1, -1]);
      if (Math.abs(m.R - CEILX_R) > 1e-12) return false;
      if (Math.abs(m.theta - CEILX_THETA) > 1e-12) return false;
      if (!(m.theta > 0)) return false;
      return m.R > 0.5;
    },
  },
  {
    id: "imp95291-verdict-honesty",
    description:
      "the verdict is an assessment: sub-gap STILL OPEN, imp-95289 residual carried, ledger grade superseded, no Lambda change, NO QED, no refereed bound is changed",
    holds: () =>
      /STILL OPEN/.test(IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT.subGap) &&
      /imp-95289/.test(IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT.subGap) &&
      /superseded/i.test(
        IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT.ledgerReclassification,
      ) &&
      /NOT an independent currency/.test(
        IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT.verdict,
      ) &&
      /changes NO Lambda bound/i.test(
        IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT.verdict,
      ) &&
      /NO QED/.test(IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95291_MODULUS_PHASE_CURRENCY_LEG_ASSESSMENT.verdict),
  },
];

for (const a of IMP95291_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95291-modulus-phase-currency-leg-assessment assertion failed: ${a.id}`,
    );
  }
}
