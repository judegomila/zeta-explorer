/**
 * imp-95441: ASSESSMENT -- does the SPECIFIC Carneiro-Littmann-Vaaler
 * (CLV) extremal-minorant instance consumed by THEOREM SEP-OPT
 * (imp-95419) -- now, after imp-95420 THEOREM P-POS, the SOLE cited
 * non-elementary input of the imp-95419 Riesz-floor chain -- admit
 * either (A) a self-contained ELEMENTARY in-repo derivation, or (B) a
 * LIGHTER classical substitute, or is it (C) sharply localized to one
 * irreducible classical atom? Assessment/scope only; changes no bound;
 * NO QED; no refereed bound is changed.
 *
 * RELATION TO imp-95421 (do not duplicate). imp-95421 already split the
 * CLV input of SEP-OPT into (i) an in-repo Gaussian-subordination
 * HYPOTHESIS (H1) p(t) > 0 [imp-95420] + (H2) int p = 1 [LEMMA MIX at
 * w = 0], (ii) a portable-in-principle reduction (L-sub), and (iii) one
 * irreducible cited sub-step (L-gau): the SINGLE-Gaussian Beurling-
 * Selberg extremal minorant of e^(-pi w^2 s). This ticket takes the two
 * questions imp-95421 explicitly left OPEN -- "is there a LIGHTER
 * classical substitute?" and "is (L-gau) PROVABLY irreducible?" -- and
 * scopes them concretely. It changes none of imp-95421's ledger; it
 * tests the natural substitutes against it.
 *
 * WHAT THE CHAIN ACTUALLY CONSUMES. SEP-OPT needs only:
 *   (need-1) EXISTENCE of an entire function k of exponential type delta
 *            with k(w) <= sech(pi w) on R, and
 *   (need-2) int_R k dw = A_lat(delta) := sum_(n in Z) (-1)^n sech(n delta/2),
 * the alternating lattice-symbol infimum (imp-95421: A_opt = A_lat by
 * the in-repo Poisson identity). The OPTIMALITY half -- that A_lat is
 * the SUPREMUM of int over ALL type-delta minorants -- is what makes the
 * floor the BEST separated-class floor; a merely-valid minorant with a
 * smaller integral still gives a VALID (weaker) floor.
 *
 * SUBSTITUTE CANDIDATE 1 -- POISSON / PARTIAL-FRACTION termwise. sech has
 * the classical residue (partial-fraction) expansion
 *   sech(pi w) = (1/pi) sum_(n >= 0) (-1)^n (2n + 1) / ((n + 1/2)^2 + w^2)
 *              = sum_(n >= 0) c_n P_n(w),  c_n = (-1)^n (2n + 1)/pi,
 * a superposition of Poisson-type kernels P_n(w) = 1/((n+1/2)^2 + w^2)
 * whose OWN Beurling-Selberg extremal minorants m_n are classically
 * known (Carneiro-Littmann). One might hope to build a minorant of sech
 * as g = sum_n c_n m_n. THIS FAILS, for two independent reasons:
 *   (F1) SIGN OBSTRUCTION (the decisive one). The coefficients c_n
 *        ALTERNATE: c_0 = 1/pi > 0, c_1 = -3/pi < 0, ... (exactly half of
 *        any initial block are negative -- verified below). For the terms
 *        with c_n > 0, m_n <= P_n gives c_n m_n <= c_n P_n; but for the
 *        terms with c_n < 0 the inequality FLIPS, c_n m_n >= c_n P_n. So
 *        g <= sech is NOT implied -- the negative-coefficient terms push
 *        g ABOVE the target. A termwise-minorant superposition of a
 *        SIGNED kernel expansion is not a minorant. This is exactly why
 *        subordination requires a NONNEGATIVE mixing measure; the
 *        nonnegative representation of the SAME function sech is the
 *        Gaussian mixture sech(pi w) = int e^(-pi^2 w^2 t) p(t) dt with
 *        p(t) >= 0 (imp-95420). The Poisson representation is signed; the
 *        Gaussian representation is positive -- and positivity is the
 *        whole content that lets subordination go through.
 *   (F2) NO LIGHTNESS GAINED even if signs were benign. The single-
 *        Poisson extremal minorant m_n is ITSELF a non-elementary
 *        classical result (same de Branges / reproducing-kernel family as
 *        the single Gaussian). Candidate 1 would trade one non-elementary
 *        atom (single Gaussian) for another (single Poisson kernel) AND
 *        pay (F1). It is not lighter.
 *
 * SUBSTITUTE CANDIDATE 2 -- any explicit SUBOPTIMAL minorant. One can
 * write down elementary type-delta minorants of sech (e.g. Fejer-kernel
 * truncations). Any such k' has int k' < A_lat (strict, since A_lat is
 * the optimum). It satisfies (need-1) but NOT (need-2): it yields a
 * VALID but strictly WEAKER floor, i.e. a DIFFERENT bound value. Since
 * this ticket changes no bound and SEP-OPT is stated at the value A_opt =
 * A_lat, candidate 2 does not substitute for the CLV instance either --
 * it substitutes a different (looser) theorem.
 *
 * IRREDUCIBILITY SCOPE. Combining the two: the specific CLV instance the
 * chain consumes (a type-delta minorant ATTAINING A_lat) is sharply
 * localized -- consistent with imp-95421 -- to the single-Gaussian atom
 * (L-gau). Its interpolation at the half-integers Z + 1/2 with integral
 * a Jacobi-theta value is equivalent, by Poisson summation, to the
 * Gaussian's theta self-duality, which is NOT derivable from LEMMA MIX
 * (partial fractions) alone. We do NOT prove a formal impossibility
 * theorem (that would require a proof-theoretic lower bound on the
 * elementary strength required); we establish the weaker, honest
 * statement: among the natural lighter classical substitutes (Poisson-
 * termwise; suboptimal-explicit) NONE reproduces the consumed instance,
 * for the concrete reasons (F1)/(F2)/(candidate 2). The residual is the
 * single-Gaussian extremal minorant, and a formal irreducibility proof
 * stays a NAMED residual.
 *
 * HONEST SCOPE AND LIMITS. (a) This assessment proves nothing new about
 * SEP-OPT; it tests substitutes against imp-95421's ledger and re-anchors
 * the partial-fraction / Gaussian representation contrast numerically.
 * (b) No formal impossibility/irreducibility theorem is claimed; "no
 * lighter substitute among the natural candidates" is not "provably
 * irreducible in an absolute sense". (c) Nothing here changes any Lambda
 * bound, onset, or floor value. (d) The imp-95212 envelope port, signed
 * WEIGHT, and modulus/phase legs stay OPEN and are untouched. NO QED.
 * No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference object (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95441_CLV_LIGHTER_SUBSTITUTE_IRREDUCIBILITY = {
  id: "imp-95441",
  title:
    "ASSESSMENT: the specific CLV extremal-minorant instance consumed by " +
    "THEOREM SEP-OPT admits NO lighter classical substitute among the two " +
    "natural candidates (Poisson-termwise fails on sign alternation; " +
    "suboptimal-explicit gives a weaker bound); residual sharply the " +
    "single-Gaussian atom (L-gau), consistent with imp-95421",
  question:
    "Does the specific CLV minorant instance the imp-95419 chain consumes " +
    "admit a self-contained elementary in-repo derivation or a lighter " +
    "classical substitute, or is it sharply localized to one irreducible " +
    "classical atom?",
  buildsOn: "imp-95421 (citation boundary), imp-95420 (P-POS), imp-95419 (SEP-OPT)",
  consumes: {
    need1: "EXISTENCE of an entire type-delta minorant k <= sech(pi w) on R",
    need2:
      "int k = A_lat = sum_(n in Z) (-1)^n sech(n delta/2) (= A_opt, imp-95421)",
    optimalityIsSeparate:
      "that A_lat is the SUP over all type-delta minorants is the OPT half; " +
      "a valid minorant with smaller integral still gives a valid weaker floor",
  },
  candidate1Poisson: {
    representation:
      "sech(pi w) = (1/pi) sum_(n>=0) (-1)^n (2n+1)/((n+1/2)^2 + w^2) = " +
      "sum c_n P_n, c_n = (-1)^n (2n+1)/pi (SIGN-ALTERNATING)",
    failF1:
      "sign obstruction: for c_n < 0 the termwise minorant inequality " +
      "c_n m_n >= c_n P_n FLIPS, so g = sum c_n m_n is NOT <= sech; " +
      "subordination needs the NONNEGATIVE Gaussian mixture (p(t)>=0, " +
      "imp-95420), not the signed Poisson mixture of the same function",
    failF2:
      "no lightness: the single-Poisson extremal minorant is itself " +
      "non-elementary (same de Branges / RKHS family as the single Gaussian)",
  },
  candidate2Suboptimal:
    "any explicit elementary type-delta minorant k' has int k' < A_lat " +
    "(A_lat optimal), so it satisfies (need-1) but not (need-2): a VALID " +
    "but WEAKER floor = a different (looser) bound, not a substitute for " +
    "the consumed A_opt instance",
  residualCited:
    "single-Gaussian Beurling-Selberg extremal minorant (L-gau); a FORMAL " +
    "irreducibility/impossibility theorem stays a NAMED residual",
  baked: {
    // partial-fraction (Poisson) reconstruction of sech(pi w), pair-summed
    sechAtHalf: 3.9853681534e-1, // sech(pi/2)
    sechAtOne: 8.6266738334e-2, // sech(pi)
    sechAtOneSeven: 9.5847374163e-3, // sech(1.7 pi)
    pfRelWorst: 5.535e-5, // worst rel err of the pair-summed reconstruction (K=3e5), w=1.7
    c0: 3.183098861838e-1, // 1/pi > 0
    c1: -9.549296585514e-1, // -3/pi < 0
    negCoeffsInFirst100: 50, // exactly half of any block alternate negative
    aLatLn2: 2.374484801080e-5, // A_lat(ln 2) = A_opt (imp-95421 anchor)
  },
  verdict:
    "NEGATIVE for a lighter substitute; consistent with imp-95421. The " +
    "specific CLV instance SEP-OPT consumes (a type-delta minorant " +
    "ATTAINING A_lat) does NOT admit an elementary in-repo derivation, and " +
    "the two natural lighter classical substitutes both FAIL for concrete " +
    "reasons: (candidate 1) sech's Poisson/partial-fraction representation " +
    "is SIGN-ALTERNATING, so termwise extremal minorants combine with the " +
    "WRONG inequality direction and yield no minorant -- the nonnegative " +
    "representation subordination needs is exactly the Gaussian mixture " +
    "whose positivity is imp-95420 -- and the single-Poisson atom is " +
    "itself non-elementary; (candidate 2) any elementary suboptimal " +
    "minorant gives int < A_lat, i.e. a valid but WEAKER floor, a " +
    "different bound. The residual is sharply the single-Gaussian atom " +
    "(L-gau). No FORMAL irreducibility theorem is proved -- 'no lighter " +
    "substitute among the natural candidates' is not 'absolutely " +
    "irreducible' -- and that formal proof stays a named residual. " +
    "Assessment only; changes no bound; the imp-95212 envelope port and " +
    "signed WEIGHT / modulus-phase legs stay OPEN; NO QED; no refereed bound is changed" +
    ".",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// Poisson / partial-fraction reconstruction of sech(pi w), summed in
// consecutive pairs (the series is conditionally convergent; pairing gives
// O(1/K) tails). K pairs.
function sechPartialFraction(w, K) {
  let s = 0;
  for (let k = 0; k < K; k++) {
    const n0 = 2 * k;
    const n1 = 2 * k + 1;
    s +=
      (2 * n0 + 1) / ((n0 + 0.5) ** 2 + w * w) -
      (2 * n1 + 1) / ((n1 + 0.5) ** 2 + w * w);
  }
  return s / Math.PI;
}

// partial-fraction coefficient c_n = (-1)^n (2n+1)/pi
function pfCoeff(n) {
  return ((n % 2 === 0 ? 1 : -1) * (2 * n + 1)) / Math.PI;
}

// alternating lattice-symbol value A_lat (= A_opt), positive-term stable form
function aLatPos(delta) {
  let s = 0;
  for (let n = 0; n < 400; n++) {
    const term = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += term;
    if (term < 1e-320) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

const REF = IMP95441_CLV_LIGHTER_SUBSTITUTE_IRREDUCIBILITY;

export const IMP95441_CLV_SUBSTITUTE_ASSERTIONS = [
  {
    id: "imp95441-poisson-representation-reconstructs-sech",
    description:
      "the classical Poisson / partial-fraction expansion reconstructs " +
      "sech(pi w) at w = 1/2, 1, 1.7 (pair-summed, K = 3e5) -- the signed " +
      "kernel representation of the target used by candidate 1",
    holds: () => {
      const cases = [
        [0.5, REF.baked.sechAtHalf],
        [1.0, REF.baked.sechAtOne],
        [1.7, REF.baked.sechAtOneSeven],
      ];
      let worst = 0;
      for (const [w, baked] of cases) {
        const d = sech(Math.PI * w);
        if (Math.abs(d - baked) / d > 1e-9) return false;
        const r = sechPartialFraction(w, 300000);
        const rel = Math.abs(d - r) / d;
        if (rel > 1e-4) return false;
        if (rel > worst) worst = rel;
      }
      return worst < 1e-4 && Math.abs(worst - REF.baked.pfRelWorst) / REF.baked.pfRelWorst < 0.2;
    },
  },
  {
    id: "imp95441-poisson-coeffs-sign-alternate",
    description:
      "(F1) the partial-fraction coefficients c_n = (-1)^n (2n+1)/pi " +
      "ALTERNATE in sign (c_0 = 1/pi > 0, c_1 = -3/pi < 0) with exactly " +
      "half of any initial block negative -- the sign obstruction that " +
      "makes a termwise-minorant superposition NOT a minorant of sech",
    holds: () => {
      if (Math.abs(pfCoeff(0) - REF.baked.c0) > 1e-12) return false;
      if (Math.abs(pfCoeff(1) - REF.baked.c1) > 1e-12) return false;
      if (!(pfCoeff(0) > 0 && pfCoeff(1) < 0)) return false;
      let neg = 0;
      for (let n = 0; n < 100; n++) if (pfCoeff(n) < 0) neg++;
      // strict alternation: sign flips every step
      for (let n = 0; n < 99; n++) {
        if (Math.sign(pfCoeff(n)) === Math.sign(pfCoeff(n + 1))) return false;
      }
      return neg === REF.baked.negCoeffsInFirst100;
    },
  },
  {
    id: "imp95441-optimal-value-anchor",
    description:
      "candidate 2 baseline: A_lat(ln 2) = A_opt is reproduced (imp-95421 " +
      "anchor); any elementary suboptimal minorant has int < this value, so " +
      "it gives a strictly weaker floor -- a different bound, not a substitute",
    holds: () =>
      Math.abs(aLatPos(Math.log(2)) - REF.baked.aLatLn2) / REF.baked.aLatLn2 <
      1e-11,
  },
  {
    id: "imp95441-verdict-honesty",
    description:
      "the verdict carries the honest split: negative for a lighter " +
      "substitute, both candidates fail for concrete reasons, residual is " +
      "the single-Gaussian atom, NO formal irreducibility theorem claimed, " +
      "consistent with imp-95421, assessment-only, open legs untouched, no QED",
    holds: () =>
      /NEGATIVE for a lighter substitute/.test(REF.verdict) &&
      /SIGN-ALTERNATING/.test(REF.verdict) &&
      /Gaussian mixture whose positivity is imp-95420/.test(REF.verdict) &&
      /WEAKER floor/.test(REF.verdict) &&
      /single-Gaussian atom/.test(REF.verdict) &&
      /No FORMAL irreducibility theorem is proved/.test(REF.verdict) &&
      /named residual/.test(REF.verdict) &&
      /Assessment only/.test(REF.verdict) &&
      /stay OPEN/.test(REF.verdict) &&
      /NO QED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      /imp-95421/.test(REF.buildsOn) &&
      REF.consumes.need2.includes("A_lat"),
  },
];

for (const a of IMP95441_CLV_SUBSTITUTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95441-clv-lighter-substitute-irreducibility assertion failed: ${a.id}`,
    );
  }
}

export default IMP95441_CLV_LIGHTER_SUBSTITUTE_IRREDUCIBILITY;
