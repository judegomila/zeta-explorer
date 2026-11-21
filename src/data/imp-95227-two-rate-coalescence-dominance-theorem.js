/**
 * imp-95227: THEOREM COAL-DOM (two-rate coalescence dominance) -- the
 * imp-95226 COROLLARY COAL-2 grid observation is now a THEOREM: the exact
 * signed two-rate shift constant is STRICTLY dominated by its coalescent
 * limit at fixed depth-in-slowest-rate units, so
 *
 *   Lambda_2(nu_1, nu_2, d) < e^(-2x) (1 + 2 x^2 + 2 x sqrt(1 + x^2)),
 *   x = nu_1 d,  for ALL 0 < nu_1 < nu_2 and d > 0,
 *
 * sharp (the coalescent/confluent span attains the right side exactly, by
 * imp-95226 COROLLARY COAL-2). This is the FIRST PROVEN depth-only signed
 * certificate at N = 2: the bound depends on x = nu_1 d alone, uniformly
 * over the second rate and over ARBITRARY REAL amplitudes. It closes the
 * item recorded OPEN in imp-95226 ("the analytic ratio-monotonicity proof
 * is OPEN") -- nineteenth leg of the seam chain.
 *
 * Object (imp-95225 LEMMA SEG-N, N = 2):
 *   Lambda_2 = sup over nonzero g(t) = a_1 e^(-nu_1 t) + a_2 e^(-nu_2 t)
 *              of [int_d^inf g^2] / [int_0^inf g^2].
 *
 * PROOF (elementary, self-contained given imp-95226 THEOREM SGN-2X).
 *
 * Step 0 (scale invariance). Substituting t -> t/nu_1 in both integrals
 * shows Lambda_2(nu_1, nu_2, d) = Lambda_2(1, 1 + s, x) with
 * s = nu_2/nu_1 - 1 > 0 and x = nu_1 d. WLOG nu_1 = 1, d = x.
 *
 * Step 1 (positive-root form). By THEOREM SGN-2X,
 *   Lambda_2 = rho(s)^2,  rho(s) = [h + sqrt(h^2 + 4P)] / 2,
 * the unique POSITIVE root of q_s(t) = t^2 - h(s) t - P(s), where
 *   h(s) = e^(-x) phi(s) (s + 2)/s,  phi(s) = 1 - e^(-s x),
 *   P(s) = w_1 w_2 = e^(-(2+s) x),
 * and h(s) > 0, P(s) > 0. Since q_s(0) = -P < 0, for t > 0 the sign
 * characterization holds: q_s(t) >= 0 iff t >= rho(s).
 *
 * Step 2 (coalescent limit constants). As s -> 0+ at fixed x:
 * phi(s)(s+2)/s -> 2x, so h -> h_0 = 2 x e^(-x), P -> P_0 = e^(-2x), and
 *   rho_0 = [h_0 + sqrt(h_0^2 + 4 P_0)]/2 = e^(-x) R,
 *   R = x + sqrt(1 + x^2),
 * with rho_0^2 = e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) -- exactly the
 * COAL-2 confluent-span pencil value. Note rho_0^2 = h_0 rho_0 + P_0
 * (rho_0 is the root of the limit quadratic) and the rationalization
 * 1/R = sqrt(1 + x^2) - x.
 *
 * Step 3 (key inequality). CLAIM: for all s > 0, x > 0,
 *   h(s) rho_0 + P(s) < h_0 rho_0 + P_0.
 * Rearranged: rho_0 (h(s) - h_0) < P_0 - P(s) = e^(-2x) phi. The left
 * side is e^(-2x) R [phi (1 + 2/s) - 2x], so the claim is equivalent to
 *   phi [R (1 + 2/s) - 1] < 2 x R .
 * Since R >= 1, the bracket is positive. Use the Pade bound
 *   phi = 1 - e^(-u) <= 2u / (2 + u),  u = s x,  strict for u > 0
 * (psi(u) = (2+u) - (2-u) e^u has psi(0) = psi_prime(0) = 0 and second
 * derivative u e^u > 0, so psi > 0 on u > 0; for u >= 2 the bound is
 * trivial since 2u/(2+u) >= 1 > phi). Substituting,
 *   phi [R(1 + 2/s) - 1] < [2 s x/(2 + s x)] [R(s+2) - s]/s
 *                        = 2 x [R(s+2) - s] / (2 + s x) ,
 * and it suffices that R(s+2) - s <= R(2 + s x), i.e. s(R - 1) <= R s x,
 * i.e. R - 1 <= R x, i.e. 1 - x <= 1/R = sqrt(1 + x^2) - x, i.e.
 *   sqrt(1 + x^2) >= 1 ,
 * which holds for every real x. CLAIM proved (strict for s > 0).
 *
 * Step 4 (root comparison). q_s(rho_0) = rho_0^2 - h(s) rho_0 - P(s)
 * = [h_0 rho_0 + P_0] - [h(s) rho_0 + P(s)] > 0 by Steps 2-3. Since
 * rho_0 > 0, the Step-1 sign characterization gives rho_0 > rho(s), so
 *   Lambda_2 = rho(s)^2 < rho_0^2 = e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)).
 * QED (of this lemma only -- no bound of the Lambda program changes).
 *
 * SHARPNESS. As s -> 0+ the constants converge (Step 2), so the sup over
 * distinct rate pairs at fixed x IS the right side, attained exactly by
 * the confluent span {e^(-nu t), t e^(-nu t)} (COAL-2). The certificate
 * cap C(x) = e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) = (e^(-x) R)^2 satisfies
 * d/dx log C = 2(-1 + 1/sqrt(1+x^2)) < 0: strictly decreasing, C(0) = 1,
 * C(x) < 1 for all x > 0 -- the depth-only N = 2 signed certificate is
 * non-vacuous at EVERY positive depth, unlike the count-priced SGN-C cap
 * (vacuous for x < ~1.386 at N = 2) and the count-uniform regime, where
 * imp-95224 COROLLARY DC-NOGO forces sup over N of the co-centered signed
 * ratio to 1/2 at every fixed depth. NO CONFLICT with DC-NOGO: this bound
 * is N = 2 specific, not count-uniform.
 *
 * CONSISTENCY FENCES. C(x) >= e^(-2x) = the exact N = 1 constant SGN-EQ
 * (adding a second rate can only raise the sup); C(x) is a factor
 * (x + sqrt(1+x^2))^2 <= (2x+1)^2 above SGN-EQ, quadratic collar 4x^2 + 2
 * + O(1/x^2) at large x as recorded in COAL-2.
 *
 * SKEPTICAL RECORD. (a) Dominance verified on the full (x, s) grid
 * x in [1e-4, 20], s in [1e-9, 1e5]: zero violations, max ratio < 1,
 * approached only as s -> 0. (b) The delicate regime is SMALL x, where
 * h(s) EXCEEDS h_0 for moderate s (h is not monotone in s there) -- the
 * proof survives because the P-decrease strictly outprices the h-increase
 * through the Pade bound; measured argmax of Lambda_2/C over s sits at
 * the smallest scanned s for every x, consistent with strict dominance.
 * (c) Key inequality, Pade bound, and the 1/R rationalization identity
 * checked numerically below; the proof pivot q_s(rho_0) > 0 asserted
 * directly on a grid. (d) Refutation attempts recorded: tried h-monotone
 * -- FALSE for x < 1/2 (h rises from 2x e^(-x) toward e^(-x)), so naive
 * monotonicity in (h, P) jointly does NOT close it; the rho_0-weighted
 * linear functional of Step 3 is the fix. Tried equality off coalescence
 * -- impossible: Pade is strict for u > 0.
 *
 * HONEST SCOPE. This closes exactly ONE named open item (the N = 2
 * depth-only analytic proof). Still OPEN on the sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port: the N = 3 (and general N)
 * depth-only envelope at fixed x = nu_min d -- CONJECTURE (new, named
 * here): the sup over N-rate sets at fixed x is the fully confluent span
 * {t^k e^(-nu t): k < N}; unproven, N = 2 is this theorem. Also OPEN:
 * signed WEIGHT port, in-octave multiplicity hybrid, off-lattice rates,
 * modulus/phase currency, envelope-shape port, paper-packet constants.
 * No bound of the Lambda program changed. NO QED on any RH-adjacent
 * statement. No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95227_TWO_RATE_COALESCENCE_DOMINANCE = {
  id: "imp-95227",
  title:
    "THEOREM COAL-DOM: the signed two-rate shift constant is strictly " +
    "dominated by its coalescent limit at fixed x = nu_1 d -- the first " +
    "proven depth-only signed N = 2 certificate, sharp at coalescence",
  statement:
    "Lambda_2(nu_1, nu_2, d) < e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) for all " +
    "0 < nu_1 < nu_2, d > 0, x = nu_1 d; sharp: the confluent span attains " +
    "the right side (imp-95226 COROLLARY COAL-2)",
  proofPivot:
    "h(s) rho_0 + P(s) < h_0 rho_0 + P_0 reduces via the Pade bound " +
    "1 - e^(-u) <= 2u/(2+u) to R - 1 <= R x with R = x + sqrt(1+x^2), i.e. " +
    "1 - x <= 1/R = sqrt(1+x^2) - x, i.e. sqrt(1+x^2) >= 1: trivially true. " +
    "Then q_s(rho_0) > 0 and the positive-root sign characterization give " +
    "rho(s) < rho_0.",
  refutedRoute:
    "joint (h, P)-monotonicity is FALSE for x < 1/2: h(s) rises above h_0 " +
    "toward e^(-x) at large s while P falls; the rho_0-weighted linear " +
    "functional is what closes the tradeoff",
  capProperties:
    "C(x) = (e^(-x)(x + sqrt(1+x^2)))^2 strictly decreasing, C(0) = 1, " +
    "C(x) < 1 for x > 0 (non-vacuous at every positive depth), " +
    "C(x) >= e^(-2x) (never below the exact N = 1 SGN-EQ constant), " +
    "large-x collar 4x^2 + 2 + O(1/x^2) above SGN-EQ",
  dcNogoConsistency:
    "N = 2 specific, NOT count-uniform: no conflict with imp-95224 " +
    "COROLLARY DC-NOGO (which forces the count-uniform depth-only signed " +
    "sup to 1/2 at every fixed depth)",
  namedSuccessor:
    "CONJECTURE (open): for every N the depth-only envelope at fixed " +
    "x = nu_min d is the fully confluent span {t^k e^(-nu t): k < N}; " +
    "N = 2 is this theorem, N >= 3 unproven",
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN. This theorem " +
    "closes the single item recorded OPEN by imp-95226 (analytic proof of " +
    "the N = 2 coalescence-dominance grid observation). Signed WEIGHT " +
    "port, in-octave multiplicity hybrid, off-lattice rates, modulus/phase " +
    "currency, envelope-shape port and paper-packet constants remain OPEN; " +
    "does NOT certify the paper packets.",
  verdict:
    "RIGOROUS at the stated scope: elementary proof from the imp-95226 " +
    "exact closed form, one Pade bound, one rationalization; strictness " +
    "and sharpness both established. Changes no bound of the Lambda " +
    "program; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

// imp-95226 THEOREM SGN-2X stable h-form closed formula
function lam2closed(nu1, nu2, d) {
  const w1 = Math.exp(-d * nu1);
  const w2 = Math.exp(-d * nu2);
  const h = (-w1 * Math.expm1(-d * (nu2 - nu1)) * (nu1 + nu2)) / (nu2 - nu1);
  return w1 * w2 + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * w1 * w2);
}
function capC(x) {
  const R = x + Math.sqrt(1 + x * x);
  const r0 = Math.exp(-x) * R;
  return r0 * r0;
}
function hOfS(s, x) {
  return (Math.exp(-x) * -Math.expm1(-s * x) * (s + 2)) / s;
}
function pOfS(s, x) {
  return Math.exp(-(2 + s) * x);
}

const X_GRID = [1e-4, 0.01, 0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1, 1.5, 2, 3, 5, 8, 12, 20];
const S_GRID = [1e-9, 1e-6, 1e-3, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5, 10, 30, 100, 1e3, 1e5];

export const IMP95227_COAL_DOM_ASSERTIONS = [
  {
    id: "imp95227-dominance-strict-on-grid",
    description:
      "THEOREM COAL-DOM: Lambda_2(1, 1+s, x) < C(x) on the full (x, s) grid, " +
      "with a strictly positive margin once s is bounded away from 0 (the " +
      "true gap at s = 1 scales like ~(2/3) x^3 as x -> 0, so the margin " +
      "fence must be x-cubed-scaled, not flat)",
    holds: () => {
      for (const x of X_GRID) {
        for (const s of S_GRID) {
          const lam = lam2closed(1, 1 + s, x);
          const cap = capC(x);
          if (!(lam <= cap * (1 + 1e-12))) return false;
          const margin = Math.min(0.5, 0.05 * x * x * x);
          if (s >= 1 && !(lam < cap * (1 - margin))) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95227-sharp-at-coalescence",
    description:
      "sharpness: at rate separation s = 1e-8 the ratio Lambda_2 / C(x) " +
      "exceeds 1 - 1e-6 for x in {0.5, 2, 5} (the cap is the true sup, " +
      "attained in the coalescent limit)",
    holds: () => {
      for (const x of [0.5, 2, 5]) {
        const r = lam2closed(1, 1 + 1e-8, x) / capC(x);
        if (!(r > 1 - 1e-6 && r <= 1 + 1e-12)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95227-proof-pivot-qs-positive",
    description:
      "Step 3-4 pivot: q_s(rho_0) = rho_0^2 - h(s) rho_0 - P(s) > 0 on the " +
      "grid (s > 0), and the rho_0 identity rho_0^2 = h_0 rho_0 + P_0 holds " +
      "to 1e-14 rel",
    holds: () => {
      for (const x of X_GRID) {
        const R = x + Math.sqrt(1 + x * x);
        const r0 = Math.exp(-x) * R;
        const h0 = 2 * x * Math.exp(-x);
        const P0 = Math.exp(-2 * x);
        if (Math.abs(r0 * r0 - (h0 * r0 + P0)) / (r0 * r0) > 1e-14) return false;
        for (const s of S_GRID) {
          if (s < 1e-6) continue;
          const q = r0 * r0 - hOfS(s, x) * r0 - pOfS(s, x);
          if (!(q > 0)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95227-key-inequality-and-pade",
    description:
      "Step 3 chain: phi [R(1+2/s) - 1] <= 2 x R on the grid; the Pade bound " +
      "1 - e^(-u) <= 2u/(2+u) holds and is strict for u > 0; the terminal " +
      "rationalization (x + sqrt(1+x^2))(sqrt(1+x^2) - x) = 1 holds to 1e-12 " +
      "(float tolerance only: sqrt(1+x^2) - x cancels ~x^2 digits at large x)",
    holds: () => {
      for (const x of X_GRID) {
        const R = x + Math.sqrt(1 + x * x);
        if (Math.abs(R * (Math.sqrt(1 + x * x) - x) - 1) > 1e-12) return false;
        for (const s of S_GRID) {
          const phi = -Math.expm1(-s * x);
          if (phi * (R * (1 + 2 / s) - 1) > 2 * x * R * (1 + 1e-13)) return false;
        }
      }
      for (const u of [1e-6, 0.01, 0.5, 1, 2, 5, 50]) {
        const lhs = -Math.expm1(-u);
        const rhs = (2 * u) / (2 + u);
        if (!(lhs < rhs)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95227-refuted-route-h-not-monotone",
    description:
      "skeptical record: joint (h, P)-monotonicity really is FALSE at " +
      "small x -- h(s) exceeds the coalescent h_0 = 2 x e^(-x) at x = 0.1, " +
      "s = 10 (so the naive route cannot close the theorem)",
    holds: () => {
      const x = 0.1;
      return hOfS(10, x) > 2 * x * Math.exp(-x);
    },
  },
  {
    id: "imp95227-cap-properties",
    description:
      "C(x) strictly decreasing on a fine grid, C < 1 for x > 0, and " +
      "C(x) >= e^(-2x) (never below the exact N = 1 SGN-EQ constant); " +
      "large-x collar: e^(2x) C(x) - (4 x^2 + 2) -> 0 like O(1/x^2)",
    holds: () => {
      let prev = 1 + 1e-15;
      for (let x = 0.001; x <= 30; x += 0.001) {
        const c = capC(x);
        if (!(c < prev && c < 1 && c >= Math.exp(-2 * x))) return false;
        prev = c;
      }
      const t20 = Math.exp(40) * capC(20) - (4 * 400 + 2);
      const t40 = Math.exp(80) * capC(40) - (4 * 1600 + 2);
      return Math.abs(t20) < 1.1 / 400 && Math.abs(t40) < 1.1 / 1600;
    },
  },
  {
    id: "imp95227-scale-invariance",
    description:
      "Step 0: Lambda_2 depends only on (x, nu_2/nu_1): the (1, 3.7, 1.2) " +
      "and (5, 18.5, 0.24) rows agree to 1e-14 rel",
    holds: () => {
      const a = lam2closed(1, 3.7, 1.2);
      const b = lam2closed(5, 18.5, 0.24);
      return Math.abs(a - b) / a < 1e-14;
    },
  },
  {
    id: "imp95227-verdict-honesty",
    description:
      "the verdict carries the honest scope: sub-gap named STILL OPEN, the " +
      "N >= 3 envelope recorded as an open CONJECTURE, remaining legs open, " +
      "paper packets not certified, DC-NOGO consistency stated, and no QED",
    holds: () =>
      /STILL OPEN/.test(IMP95227_TWO_RATE_COALESCENCE_DOMINANCE.subGap) &&
      /remain OPEN/.test(IMP95227_TWO_RATE_COALESCENCE_DOMINANCE.subGap) &&
      /does NOT certify the paper packets/.test(
        IMP95227_TWO_RATE_COALESCENCE_DOMINANCE.subGap,
      ) &&
      /unproven/.test(IMP95227_TWO_RATE_COALESCENCE_DOMINANCE.namedSuccessor) &&
      /NOT count-uniform/.test(
        IMP95227_TWO_RATE_COALESCENCE_DOMINANCE.dcNogoConsistency,
      ) &&
      /NO QED/.test(IMP95227_TWO_RATE_COALESCENCE_DOMINANCE.verdict) &&
      /refereed bound is changed/i.test(IMP95227_TWO_RATE_COALESCENCE_DOMINANCE.verdict),
  },
];

for (const a of IMP95227_COAL_DOM_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95227-two-rate-coalescence-dominance-theorem assertion failed: ${a.id}`,
    );
  }
}

export default IMP95227_TWO_RATE_COALESCENCE_DOMINANCE;
