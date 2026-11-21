/**
 * imp-95420: LEMMA P-SYM + LEMMA P-JAC + LEMMA P-MONO + THEOREM P-POS --
 * a SELF-CONTAINED elementary proof that the theta density p(t) of the
 * imp-95419 LEMMA MIX Gaussian-mixture representation of sech is
 * strictly positive for ALL t > 0, WITH explicit two-sided enclosures.
 * This dissolves the second cited classical input of imp-95419 (the
 * Brownian first-exit-time positivity citation, Karatzas-Shreve Ch. 2 /
 * Biane-Pitman-Yor Bull. AMS 38 (2001)), which imp-95419 itself named
 * a residual ("a fully self-contained in-repo proof of either is a
 * named residual"). The remaining classical inputs of the SEP-OPT
 * chain shrink to: (i) the Carneiro-Littmann-Vaaler extremal minorant,
 * and (ii) Poisson summation for Schwartz functions -- and (ii) is the
 * SAME tool imp-95419 already uses for its "elementary Poisson
 * identity", so no new citation class is introduced and the
 * probabilistic input is ELIMINATED. Changes no bound of the Lambda
 * program; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95419 LEMMA MIX). The theta density
 *   p(t) = pi sum_(n >= 0) (-1)^n (2n + 1) e^(-(n + 1/2)^2 pi^2 t)
 * with modular dual form
 *   p(t) = (1 / (t sqrt(pi t))) sum_(k >= 1) (-1)^(k+1) (2k - 1)
 *          e^(-(2k-1)^2 / (4 t)) ,
 * satisfying sech(x) = int_0^inf e^(-x^2 t) p(t) dt (termwise Laplace
 * transform of the classical partial-fraction expansion of sech).
 * imp-95419 needed p(t) > 0 (so that sech(pi w) is a PROBABILITY
 * mixture of Gaussians, the Gaussian-subordination hypothesis of CLV)
 * and CITED it from the exit-time literature. Here it is PROVED.
 *
 * LEMMA P-SYM (symmetrization; elementary algebra). With
 * S(t) := sum_(n in Z) (-1)^n (n + 1/2) e^(-(n + 1/2)^2 pi^2 t), the
 * substitution n -> -1 - m maps (-1)^n -> -(-1)^m and (n + 1/2) ->
 * -(m + 1/2) with the exponential unchanged, so the n <= -1 half
 * duplicates the n >= 0 half termwise; hence S(t) =
 * sum_(n >= 0) (-1)^n (2n + 1) e^(-(n + 1/2)^2 pi^2 t) and
 * p(t) = pi S(t).
 *
 * LEMMA P-JAC (modular dual identity; Poisson summation on a shifted
 * Gaussian). Let f(x) = x e^(-pi^2 t x^2) e^(i pi x), a Schwartz
 * function. Since e^(i pi (n + 1/2)) = i (-1)^n,
 *   sum_(n in Z) f(n + 1/2) = i S(t) .
 * Poisson summation (classical, Schwartz class; applied to
 * x -> f(x + 1/2)) gives sum_n f(n + 1/2) = sum_m fhat(m) (-1)^m with
 * fhat(xi) = int f(x) e^(-2 pi i xi x) dx. From the Gaussian pair
 * ghat(eta) = (1/sqrt(pi t)) e^(-eta^2 / t) for g = e^(-pi^2 t x^2)
 * and differentiation under the transform
 * (int x g e^(-2 pi i eta x) dx = (i / (2 pi)) ghat'(eta)):
 *   fhat(m) = -i (m - 1/2) / (pi t sqrt(pi t)) e^(-(m - 1/2)^2 / t) .
 * Hence S(t) = -(1 / (pi t sqrt(pi t))) sum_(m in Z) (-1)^m (m - 1/2)
 * e^(-(m - 1/2)^2 / t); the substitution m -> 1 - m shows the m <= 0
 * half duplicates the m >= 1 half, and with (m - 1/2) = (2m - 1)/2:
 *   p(t) = pi S(t) = (1 / (t sqrt(pi t))) sum_(m >= 1) (-1)^(m+1)
 *          (2m - 1) e^(-(2m-1)^2 / (4 t))    for ALL t > 0 .
 * The two theta forms are therefore EQUAL (previously only numerically
 * cross-checked in imp-95419).
 *
 * LEMMA P-MONO (strict term decrease in two overlapping regimes; both
 * boundary cases reduce to ln 3 < 2).
 * (theta regime) a_n := (2n + 1) e^(-(n + 1/2)^2 pi^2 t). Then
 * ln(a_(n+1) / a_n) = ln(1 + 2/(2n+1)) - pi^2 t (2n + 2)
 *                   < 2/(2n+1) - pi^2 t (2n + 2)      [ln(1+u) < u]
 * and for t >= 1/pi^2 this is <= 2/(2n+1) - (2n+2) <= 2 - 2 = 0 with
 * the first inequality strict; so (a_n) is strictly decreasing for
 * every t >= 1/pi^2. (At the boundary n = 0, t = 1/pi^2 the raw ratio
 * statement is exactly ln 3 < 2.)
 * (dual regime) b_k := (2k - 1) e^(-(2k-1)^2 / (4t)), k >= 1. Then
 * ln(b_(k+1) / b_k) = ln(1 + 2/(2k-1)) - 2k/t < 2/(2k-1) - 2k/t
 * and for t <= 1 this is <= 2/(2k-1) - 2k <= 2 - 2 = 0, strict as
 * before; so (b_k) is strictly decreasing for every 0 < t <= 1. (At
 * k = 1, t = 1: again exactly ln 3 < 2.)
 *
 * THEOREM P-POS (strict positivity + explicit enclosures). For an
 * alternating series sum (-1)^j c_j with c_j strictly decreasing to 0,
 * the partial sums bracket: the sum lies strictly in
 * (c_0 - c_1, c_0). Applying this with LEMMA P-MONO:
 * (theta regime, t >= 1/pi^2)
 *   pi e^(-pi^2 t / 4) (1 - 3 e^(-2 pi^2 t)) < p(t)
 *     < pi e^(-pi^2 t / 4) ,
 * and the lower factor is positive there since 3 e^(-2 pi^2 t) <=
 * 3 e^(-2) < 1.
 * (dual regime, 0 < t <= 1, via LEMMA P-JAC)
 *   (e^(-1/(4t)) / (t sqrt(pi t))) (1 - 3 e^(-2/t)) < p(t)
 *     < e^(-1/(4t)) / (t sqrt(pi t)) ,
 * with 3 e^(-2/t) <= 3 e^(-2) < 1 -- the SAME constant 3 e^(-2) =
 * 0.406 < 1 closes both regimes. Since 1/pi^2 = 0.101321 < 1 the two
 * regimes OVERLAP and cover (0, infinity):
 *   p(t) > 0 for ALL t > 0 . QED (of this positivity statement, at
 * this scope, with Poisson summation for Schwartz functions plus the
 * Gaussian Fourier pair as the only classical inputs).
 *
 * CONSEQUENCE FOR imp-95419. LEMMA MIX is now conditional only on the
 * termwise partial-fraction expansion of sech (classical, Euler) --
 * its positivity input is in-repo. THEOREM SEP-OPT remains conditional
 * on exactly ONE non-elementary citation: the CLV extremal-minorant
 * existence and value. The imp-95419 module text and its baked
 * citedInputs.length === 2 assertion are a correct HISTORICAL record
 * of what was cited there and are deliberately NOT edited; this module
 * is the supersession record.
 *
 * FLOAT TRAP (asserted below, extends the imp-95419 trap family). The
 * direct theta form is catastrophically cancellation-limited in
 * doubles for small t: at t = 1e-3 the true p(t) ~ e^(-250) ~ 5e-105
 * while the direct-form roundoff floor is ~1e-16, a ~1e90 relative
 * error. ALL small-t evaluation must use the dual form; the identity
 * is numerically verifiable in doubles only on a band (worst rel
 * 1.97e-12 on [0.02, 5]). Near-regime-edge enclosure gaps (pi a_2,
 * b_3 terms) fall below 1 ULP of p, so STRICT bracketing is
 * numerically checked only where doubles resolve the gap
 * ([1/pi^2, 0.4] theta, [0.25, 1] dual); the tolerance-checked
 * two-sided enclosure runs over the full regimes.
 *
 * SKEPTICAL RECORD. (1) LEMMA P-JAC verified to 1.97e-12 worst rel
 * on 200 log-spaced t in [0.02, 5]. (2) Enclosures verified across
 * [1/pi^2, 60] (theta) and [1e-3, 1] (dual) at ULP tolerance, strict
 * on the resolvable windows; lower bounds positive everywhere
 * sampled. (3) Term monotonicity verified at the EXACT regime
 * boundaries t = 1/pi^2 and t = 1. (4) Mixture mass: Simpson on
 * [0.02, 20] with the per-regime stable form gives deficit
 * 1 - mass = 1.188e-6, POSITIVE and BELOW the analytic head bound
 * int_0^0.02 p <= (2/sqrt(pi S)) e^(-S) = 1.189e-6 at S = 12.5 (tail
 * <= (4/pi) e^(-pi^2 T/4) = 4.7e-22 at T = 20) -- the deficit is
 * exactly the analytically-bounded truncation, not error. (5) The
 * LEMMA MIX role is verified in-repo: int e^(-x^2 t) p dt matches
 * sech(x) at x = 0.5, 1, 2 with deficits 1.10e-6..1.18e-6, each
 * inside (0, head bound). (6) The float trap is asserted REAL: the
 * direct form at t = 1e-3 disagrees with the dual form by > 1e10
 * relative. (7) Boundary constant ln 3 = 1.0986 < 2 and overlap
 * 1/pi^2 < 1 asserted.
 *
 * HONEST SCOPE AND LIMITS. (a) This proves POSITIVITY of p and the
 * dual identity only; the CLV extremal-minorant input of THEOREM
 * SEP-OPT stays a cited classical input (still a named residual).
 * (b) Poisson summation for Schwartz functions and the Gaussian
 * Fourier pair are used as classical facts (Stein-Shakarchi, Fourier
 * Analysis, Ch. 5) -- the same tool class imp-95419 already used; a
 * from-scratch Fourier-series proof of Poisson summation is NOT
 * attempted here. (c) Nothing here changes any Lambda bound, any
 * onset, or any floor value; it removes one citation from the
 * imp-95419 conditionality ledger. (d) The imp-95212 envelope port,
 * signed WEIGHT, modulus/phase legs, and imp-95374 stay OPEN and are
 * untouched. NO QED of anything beyond the stated positivity lemma.
 * No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95420_EXIT_DENSITY_POSITIVITY = {
  id: "imp-95420",
  title:
    "THEOREM P-POS: self-contained elementary positivity of the theta " +
    "density p(t) with explicit two-sided enclosures -- the imp-95419 " +
    "LEMMA MIX exit-time citation is dissolved",
  statement:
    "p(t) = pi sum (-1)^n (2n+1) e^(-(n+1/2)^2 pi^2 t) > 0 for all t > 0, " +
    "with pi e^(-pi^2 t/4)(1 - 3e^(-2 pi^2 t)) < p(t) < pi e^(-pi^2 t/4) " +
    "for t >= 1/pi^2 and (e^(-1/(4t))/(t sqrt(pi t)))(1 - 3e^(-2/t)) < " +
    "p(t) < e^(-1/(4t))/(t sqrt(pi t)) for 0 < t <= 1",
  route:
    "LEMMA P-SYM (index symmetrization) + LEMMA P-JAC (modular dual " +
    "identity by Poisson summation on x e^(-pi^2 t x^2) e^(i pi x), " +
    "Gaussian pair + differentiation under the transform) + LEMMA P-MONO " +
    "(strict term decrease for t >= 1/pi^2 direct / t <= 1 dual, both " +
    "boundary cases = ln 3 < 2) + alternating-series bracketing; regimes " +
    "overlap since 1/pi^2 < 1",
  supersedes:
    "imp-95419 citedInputs[1] (Brownian first-exit-time density " +
    "positivity, Karatzas-Shreve / Biane-Pitman-Yor): the SEP-OPT chain " +
    "citation ledger drops to CLV + Poisson summation; the imp-95419 " +
    "module text is a historical record, deliberately not edited",
  regimes: {
    thetaFrom: 0.10132118364233778, // 1/pi^2
    dualUpTo: 1.0,
    overlapNonempty: true,
    boundaryConstant: 1.0986122886681096, // ln 3, must be < 2 in both regimes
  },
  baked: {
    pAtHalf: 9.147304512678e-1, // both forms, rel 1e-12
    pAtThetaFrom: 1.483528847793, // p(1/pi^2)
    thetaLowAtThetaFrom: 1.453310529974,
    thetaUpAtThetaFrom: 2.446674818707,
    pAtT002Dual: 7.433597573671e-4,
    identityWorstRelOnBand: 1.97e-12, // [0.02, 5], 200 log-spaced points
    massDeficitSimpson: 1.188e-6, // 1 - Simpson[0.02,20], positive
    headBoundEps002: 1.189e-6, // (2/sqrt(pi S)) e^(-S), S = 12.5
  },
  citedInputs: [
    "Poisson summation for Schwartz functions + the Gaussian Fourier " +
      "pair (Stein-Shakarchi, Fourier Analysis, Ch. 5) -- the same " +
      "classical tool class already used by the imp-95419 Poisson " +
      "identity; the probabilistic exit-time citation is eliminated",
  ],
  verdict:
    "RIGOROUS and SELF-CONTAINED at the stated scope: strict positivity " +
    "of the theta density p(t) on all of (0, infinity) with explicit " +
    "two-sided enclosures, proved by elementary alternating-series " +
    "bracketing in two overlapping regimes glued by a Poisson-summation " +
    "dual identity (LEMMA P-JAC); both regime boundaries reduce to " +
    "ln 3 < 2. This dissolves the exit-time-density citation of the " +
    "imp-95419 LEMMA MIX; THEOREM SEP-OPT remains conditional on exactly " +
    "one non-elementary cited input (the Carneiro-Littmann-Vaaler " +
    "extremal minorant), which stays a named residual. Float trap: the " +
    "direct theta form is unusable in doubles below t ~ 0.02; dual form " +
    "mandatory. Changes no bound of the Lambda program; the envelope " +
    "port, signed WEIGHT, and modulus/phase legs stay OPEN; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// theta density, direct form (stable for larger t)
function pDirect(t) {
  let p = 0;
  for (let n = 0; n < 600; n++) {
    const term =
      (n % 2 === 0 ? 1 : -1) *
      (2 * n + 1) *
      Math.exp(-((n + 0.5) ** 2) * Math.PI * Math.PI * t);
    p += term;
    if (n > 3 && Math.abs(term) < 1e-320) break;
  }
  return Math.PI * p;
}

// theta density, modular dual form (stable for small t)
function pDual(t) {
  let p = 0;
  for (let k = 1; k < 600; k++) {
    const term =
      (k % 2 === 1 ? 1 : -1) *
      (2 * k - 1) *
      Math.exp(-((2 * k - 1) ** 2) / (4 * t));
    p += term;
    if (k > 3 && Math.abs(term) < 1e-320) break;
  }
  return p / (t * Math.sqrt(Math.PI * t));
}

function pStable(t) {
  return t < 0.15 ? pDual(t) : pDirect(t);
}

// THEOREM P-POS enclosure functions
function thetaLow(t) {
  return (
    Math.PI *
    Math.exp((-Math.PI * Math.PI * t) / 4) *
    (1 - 3 * Math.exp(-2 * Math.PI * Math.PI * t))
  );
}
function thetaUp(t) {
  return Math.PI * Math.exp((-Math.PI * Math.PI * t) / 4);
}
function dualLow(t) {
  return (
    (Math.exp(-1 / (4 * t)) / (t * Math.sqrt(Math.PI * t))) *
    (1 - 3 * Math.exp(-2 / t))
  );
}
function dualUp(t) {
  return Math.exp(-1 / (4 * t)) / (t * Math.sqrt(Math.PI * t));
}

function simpson(f, a, b, nPanels) {
  const h = (b - a) / nPanels;
  let s = f(a) + f(b);
  for (let i = 1; i < nPanels; i++) s += (i % 2 === 1 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

const T_THETA = 1 / (Math.PI * Math.PI);
const REF = IMP95420_EXIT_DENSITY_POSITIVITY;

export const IMP95420_P_POS_ASSERTIONS = [
  {
    id: "imp95420-pjac-identity",
    description:
      "LEMMA P-JAC: the direct and modular-dual theta forms agree to " +
      "1e-9 rel on 200 log-spaced t in [0.02, 5] (measured worst " +
      "1.97e-12), and both reproduce the baked p(0.5) to 1e-11",
    holds: () => {
      for (let i = 0; i <= 200; i++) {
        const t = 0.02 * Math.pow(250, i / 200);
        const a = pDirect(t);
        const b = pDual(t);
        if (Math.abs(a - b) / Math.max(Math.abs(a), 1e-300) > 1e-9)
          return false;
      }
      const ph = REF.baked.pAtHalf;
      return (
        Math.abs(pDirect(0.5) - ph) / ph < 1e-11 &&
        Math.abs(pDual(0.5) - ph) / ph < 1e-11
      );
    },
  },
  {
    id: "imp95420-theta-enclosure",
    description:
      "THEOREM P-POS theta regime: pi e^(-pi^2 t/4)(1 - 3e^(-2 pi^2 t)) " +
      "<= p <= pi e^(-pi^2 t/4) at ULP tolerance across [1/pi^2, 60], " +
      "lower bound positive throughout, STRICT bracket on the " +
      "doubles-resolvable window [1/pi^2, 0.4]",
    holds: () => {
      for (let i = 0; i <= 120; i++) {
        const t = T_THETA * Math.pow(60 / T_THETA, i / 120);
        const p = pDirect(t);
        const lo = thetaLow(t);
        const up = thetaUp(t);
        if (!(lo > 0)) return false;
        if (p < lo * (1 - 1e-12) || p > up * (1 + 1e-12)) return false;
      }
      for (let i = 0; i <= 40; i++) {
        const t = T_THETA + ((0.4 - T_THETA) * i) / 40;
        const p = pDirect(t);
        if (!(thetaLow(t) < p && p < thetaUp(t))) return false;
      }
      const lo0 = thetaLow(T_THETA);
      const up0 = thetaUp(T_THETA);
      const p0 = pDirect(T_THETA);
      return (
        Math.abs(lo0 - REF.baked.thetaLowAtThetaFrom) < 1e-9 &&
        Math.abs(up0 - REF.baked.thetaUpAtThetaFrom) < 1e-9 &&
        Math.abs(p0 - REF.baked.pAtThetaFrom) < 1e-9
      );
    },
  },
  {
    id: "imp95420-dual-enclosure",
    description:
      "THEOREM P-POS dual regime: (e^(-1/(4t))/(t sqrt(pi t)))" +
      "(1 - 3e^(-2/t)) <= p <= e^(-1/(4t))/(t sqrt(pi t)) at ULP " +
      "tolerance across [1e-3, 1], lower bound positive throughout, " +
      "STRICT bracket on [0.25, 1]; baked p(0.02) reproduced",
    holds: () => {
      for (let i = 0; i <= 120; i++) {
        const t = 0.001 * Math.pow(1000, i / 120);
        const p = pDual(t);
        const lo = dualLow(t);
        const up = dualUp(t);
        if (!(lo > 0)) return false;
        if (p < lo * (1 - 1e-12) || p > up * (1 + 1e-12)) return false;
      }
      for (let i = 0; i <= 40; i++) {
        const t = 0.25 + (0.75 * i) / 40;
        const p = pDual(t);
        if (!(dualLow(t) < p && p < dualUp(t))) return false;
      }
      const p02 = REF.baked.pAtT002Dual;
      return Math.abs(pDual(0.02) - p02) / p02 < 1e-11;
    },
  },
  {
    id: "imp95420-mono-and-overlap",
    description:
      "LEMMA P-MONO at the exact regime boundaries: theta terms a_n " +
      "strictly decrease at t = 1/pi^2, dual terms b_k strictly decrease " +
      "at t = 1; both boundary cases are ln 3 < 2; regimes overlap " +
      "(1/pi^2 < 1)",
    holds: () => {
      let prev = Infinity;
      for (let n = 0; n <= 60; n++) {
        const a =
          (2 * n + 1) * Math.exp(-((n + 0.5) ** 2) * Math.PI * Math.PI * T_THETA);
        if (a < 1e-300) break;
        if (!(a < prev)) return false;
        prev = a;
      }
      prev = Infinity;
      for (let k = 1; k <= 25; k++) {
        const b = (2 * k - 1) * Math.exp(-((2 * k - 1) ** 2) / 4);
        if (b < 1e-300) break;
        if (!(b < prev)) return false;
        prev = b;
      }
      const ln3 = Math.log(3);
      if (!(ln3 < 2)) return false;
      if (Math.abs(ln3 - REF.regimes.boundaryConstant) > 1e-12) return false;
      if (!(3 * Math.exp(-2) < 1)) return false;
      return T_THETA < 1 && Math.abs(T_THETA - REF.regimes.thetaFrom) < 1e-15;
    },
  },
  {
    id: "imp95420-mixture-mass",
    description:
      "total mass: 1 - Simpson[0.02, 20] of p is POSITIVE and below the " +
      "analytic head bound (2/sqrt(pi S)) e^(-S) = 1.189e-6 at " +
      "S = 1/(4 eps) = 12.5 (plus the (4/pi) e^(-pi^2 T/4) tail and a " +
      "small Simpson slack) -- the deficit is the analytically-bounded " +
      "truncation, not error",
    holds: () => {
      const mass = simpson(pStable, 0.02, 20, 6000);
      const S = 1 / (4 * 0.02);
      const head = (2 / Math.sqrt(Math.PI * S)) * Math.exp(-S);
      const tail = (4 / Math.PI) * Math.exp((-Math.PI * Math.PI * 20) / 4);
      const deficit = 1 - mass;
      if (Math.abs(head - REF.baked.headBoundEps002) / head > 1e-3)
        return false;
      return deficit > -1e-10 && deficit < head + tail + 1e-8;
    },
  },
  {
    id: "imp95420-laplace-mixture",
    description:
      "LEMMA MIX role verified in-repo: int e^(-x^2 t) p(t) dt " +
      "reproduces sech(x) at x = 0.5, 1, 2 with each deficit inside " +
      "(0 - eps, head bound + slack) since the e^(-x^2 t) weight is <= 1",
    holds: () => {
      const S = 1 / (4 * 0.02);
      const head = (2 / Math.sqrt(Math.PI * S)) * Math.exp(-S);
      for (const x of [0.5, 1, 2]) {
        const v = simpson(
          (t) => Math.exp(-x * x * t) * pStable(t),
          0.02,
          20,
          6000,
        );
        const deficit = sech(x) - v;
        if (!(deficit > -1e-10 && deficit < head + 1e-8)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95420-float-trap",
    description:
      "the small-t float trap is REAL: at t = 1e-3 the direct theta form " +
      "disagrees with the dual form by more than 1e10 relative (true " +
      "p ~ 5e-105 vs a ~1e-16 roundoff floor); dual form mandatory below " +
      "t ~ 0.02",
    holds: () => {
      const t = 1e-3;
      const truth = pDual(t);
      if (!(truth > 0 && truth < 1e-100)) return false;
      return Math.abs(pDirect(t) - truth) / truth > 1e10;
    },
  },
  {
    id: "imp95420-verdict-honesty",
    description:
      "the verdict carries the honest scope: self-contained positivity " +
      "only, CLV stays the one cited non-elementary input of SEP-OPT, " +
      "float trap named, open legs untouched, no QED beyond the lemma",
    holds: () =>
      /SELF-CONTAINED at the stated scope/.test(REF.verdict) &&
      /exactly [\s\S]*one non-elementary cited input/.test(REF.verdict) &&
      /named residual/.test(REF.verdict) &&
      /dual form [\s\S]*mandatory/.test(REF.verdict) &&
      /stay OPEN/.test(REF.verdict) &&
      /NO QED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      REF.citedInputs.length === 1 &&
      /historical record/.test(REF.supersedes),
  },
];

for (const a of IMP95420_P_POS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95420-exit-density-positivity-selfcontained assertion failed: ${a.id}`,
    );
  }
}

export default IMP95420_EXIT_DENSITY_POSITIVITY;
