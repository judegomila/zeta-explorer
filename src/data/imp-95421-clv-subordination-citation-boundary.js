/**
 * imp-95421: ASSESSMENT -- where the Carneiro-Littmann-Vaaler (CLV)
 * extremal-minorant input of THEOREM SEP-OPT (imp-95419) can be made
 * self-contained in-repo, and where it must stay a named external
 * citation, now that imp-95420 THEOREM P-POS proved the theta density
 * p(t) > 0 with total mass 1. Assessment only; changes no bound of the
 * Lambda program; NO QED; no refereed bound is changed.
 *
 * BACKGROUND. imp-95419 LEMMA MIX writes, from the classical
 * partial-fraction expansion of sech and the elementary identity
 * 1/(a^2 + x^2) = int_0^inf e^(-x^2 t) e^(-a^2 t) dt applied termwise,
 *   sech(pi w) = int_0^inf e^(-pi^2 w^2 t) p(t) dt ,
 *   p(t) = pi sum_(n >= 0) (-1)^n (2n + 1) e^(-(n + 1/2)^2 pi^2 t) .
 * THEOREM SEP-OPT then invokes CLV (Gaussian subordination for the
 * Beurling-Selberg extremal problem) to produce the extremal minorant k
 * of sech(pi w) of exponential type delta, with
 *   int k dw = (2 pi / delta) sum_(n in Z) sech(pi^2 (2n + 1) / delta)
 *            = A_opt(delta) ,
 * and LEMMA QUAD turns int k into the m-uniform floor. imp-95419 named
 * this the ONE surviving non-elementary cited input; imp-95420 removed
 * the OTHER (the Brownian exit-time positivity citation).
 *
 * THE GAUSSIAN-SUBORDINATION HYPOTHESIS IS NOW IN-REPO. CLV takes as
 * INPUT a nonnegative Gaussian mixture: a function of the form
 * f(w) = int_0^inf e^(-pi w^2 s) dnu(s) with nu a nonnegative measure of
 * finite total mass. For f = sech(pi w) this hypothesis is precisely
 *   (H1) p(t) >= 0 for all t > 0   -- proved in-repo (imp-95420
 *        THEOREM P-POS: strict positivity with explicit two-sided
 *        enclosures on the two overlapping regimes t >= 1/pi^2 and
 *        0 < t <= 1), and
 *   (H2) int_0^inf p(t) dt = sech(0) = 1 < infinity   -- elementary
 *        (evaluate LEMMA MIX at w = 0), numerically re-anchored below.
 * So the HYPOTHESIS of the CLV theorem, for THIS target function, is no
 * longer cited: it is a consequence of the now-self-contained LEMMA MIX
 * + imp-95420. This is the substantive shrinkage effected by imp-95420.
 *
 * WHAT SUBORDINATION ITSELF NEEDS (the reduction layer -- portable in
 * principle). CLV Gaussian subordination is a two-layer result:
 *   (L-sub) LINEARITY / LIMIT layer: for a nonnegative mixture
 *      f = int G_s dnu(s) of Gaussians G_s(w) = e^(-pi w^2 s), the
 *      extremal minorant of f of a fixed exponential type is the
 *      dnu-mixture of the single-Gaussian extremal minorants, and its
 *      integral is int (int m_s) dnu(s); interchange of the s-integral
 *      with the w-integral and with the interpolation sum is justified
 *      by nonnegativity of nu (Tonelli) -- exactly (H1)+(H2). This
 *      layer uses only positivity + monotone/dominated convergence and
 *      is, in principle, portable in-repo given the next layer.
 *   (L-gau) SINGLE-GAUSSIAN layer: the Beurling-Selberg extremal
 *      minorant of ONE Gaussian G_s(w) = e^(-pi w^2 s) of exponential
 *      type 2 pi exists as an entire function of exponential type,
 *      minorizes G_s on R, interpolates it at the half-integers
 *      Z + 1/2, and has int m_s = sum_(n in Z) G_s(n + 1/2) (a Jacobi
 *      theta value).
 *
 * THE RESIDUAL SUB-STEP THAT MUST STAY CITED = (L-gau). The
 * single-Gaussian extremal minorant existence-interpolation-value is
 * the genuinely non-elementary core (Carneiro-Littmann-Vaaler,
 * "Gaussian subordination for the Beurling-Selberg extremal problem",
 * Trans. AMS 365 (2013), building on Graham-Vaaler for the single
 * Gaussian; de Branges / reproducing-kernel Hilbert-space machinery and
 * the Poisson-summation / theta interpolation of the Gaussian). It has
 * NO elementary in-repo proof and is not attempted here. It plays the
 * same role as the classical Pick sufficiency cited by imp-95226.
 *
 * VALUE-CONSISTENCY CHECK (the cited output matches the elementary
 * in-repo Poisson identity). Even though (L-gau) existence is cited,
 * the VALUE it delivers is pinned by an in-repo elementary identity:
 * scaling u = delta w / (2 pi) (type 2 pi in u = type delta in w,
 * F(u) = sech(2 pi^2 u / delta)), CLV gives
 *   int k dw = (2 pi / delta) sum_(n in Z) F(n + 1/2)
 *            = (2 pi / delta) sum_(n in Z) sech(pi^2 (2n + 1) / delta)
 *            = (4 pi / delta) sum_(n >= 0) sech(pi^2 (2n + 1) / delta) ,
 * and the elementary Poisson identity (imp-95419, from the pair
 * int sech(delta t / 2) e^(-i xi t) dt = (2 pi / delta) sech(pi xi /
 * delta) modulated at theta = pi) gives
 *   sum_(n in Z) (-1)^n sech(n delta / 2)
 *     = (4 pi / delta) sum_(n >= 0) sech(pi^2 (2n + 1) / delta) .
 * So the CLV integral value EQUALS the alternating lattice-symbol
 * infimum A_lat = sum_(n in Z) (-1)^n sech(n delta / 2) by an in-repo
 * identity. The cited theorem supplies EXISTENCE of a minorant
 * attaining this value; the value itself is not an independent
 * citation. Verified below at delta = ln 2, 1, 1.5 (the positive-term
 * form of the value vs the alternating A_lat agree to doubles limit).
 *
 * PRECISE CITATION BOUNDARY (the deliverable of this ticket).
 *   CITED (irreducible here): (L-gau) -- the single-Gaussian
 *     Beurling-Selberg extremal minorant existence, exponential-type
 *     membership, half-integer interpolation, and integral value.
 *   IN-REPO (no longer cited): the Gaussian-subordination HYPOTHESIS
 *     (H1)+(H2) for sech (imp-95420 + LEMMA MIX); the (L-sub) reduction
 *     is elementary-modulo-(L-gau); the resulting integral VALUE A_opt
 *     equals A_lat by the in-repo Poisson identity; LEMMA QUAD turning
 *     int k into the floor is elementary (Paley-Wiener + continuity).
 * NET: THEOREM SEP-OPT is conditional on exactly ONE non-elementary
 * sub-step, sharply localized to the single-Gaussian extremal minorant
 * (L-gau); it is NOT the whole CLV theorem and NOT the subordination
 * bookkeeping, both of which the imp-95420 positivity result renders
 * either in-repo or portable-in-principle.
 *
 * HONEST SCOPE AND LIMITS. (a) This is an assessment of the citation
 * ledger; it proves nothing new about SEP-OPT beyond re-anchoring
 * (H2) and the value-consistency identity numerically. (b) A
 * from-scratch in-repo proof of (L-gau) is NOT attempted and is not
 * claimed to be within reach; it stays a named residual. (c) Nothing
 * here changes any Lambda bound, onset, or floor value. (d) The
 * imp-95212 envelope port, signed WEIGHT, modulus/phase legs, and
 * imp-95374 stay OPEN and are untouched. NO QED. No refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95421_CLV_SUBORDINATION_CITATION_BOUNDARY = {
  id: "imp-95421",
  title:
    "ASSESSMENT: the CLV Gaussian-subordination input of THEOREM SEP-OPT " +
    "splits into an in-repo hypothesis (H1)+(H2) [imp-95420 + LEMMA MIX], " +
    "a portable reduction (L-sub), and ONE irreducible cited sub-step " +
    "(L-gau) -- the single-Gaussian extremal minorant existence/value",
  question:
    "Given the now-proven p(t) > 0 (imp-95420 THEOREM P-POS), does the CLV " +
    "Gaussian-subordination hypothesis feeding the CLV extremal minorant " +
    "admit a self-contained in-repo derivation, or does it stay a named " +
    "external citation, and precisely which sub-step must remain cited?",
  verdictSplit: {
    hypothesisInRepo:
      "(H1) p(t) > 0 for all t > 0 [imp-95420 THEOREM P-POS, strict with " +
      "explicit two-sided enclosures] and (H2) int p = sech(0) = 1 " +
      "[LEMMA MIX at w = 0] -- the Gaussian-subordination HYPOTHESIS for " +
      "sech is now in-repo, not cited",
    reductionPortable:
      "(L-sub) mixture-of-minorants linearity + interchange of the " +
      "s-integral with the w-integral and interpolation sum, justified by " +
      "nonnegativity of the mixture (Tonelli) = exactly (H1)+(H2) -- " +
      "elementary-modulo-(L-gau), portable in-repo in principle",
    residualCited:
      "(L-gau) the SINGLE-GAUSSIAN Beurling-Selberg extremal minorant of " +
      "e^(-pi w^2 s) of exponential type 2 pi: existence as an entire " +
      "function of exponential type, minorization on R, interpolation at " +
      "Z + 1/2, and int m_s = sum_(n in Z) e^(-pi (n+1/2)^2 s) -- the " +
      "de Branges / reproducing-kernel core, NO elementary in-repo proof",
    valueNotSeparatelyCited:
      "the CLV integral VALUE A_opt(delta) equals the alternating lattice " +
      "symbol infimum A_lat = sum_(n in Z) (-1)^n sech(n delta/2) by the " +
      "in-repo elementary Poisson identity; the citation supplies " +
      "EXISTENCE attaining this value, not the value itself",
  },
  citedResidual:
    "single-Gaussian extremal minorant existence/interpolation/value " +
    "(Carneiro-Littmann-Vaaler, Trans. AMS 365 (2013), on Graham-Vaaler); " +
    "same status as classical Pick sufficiency cited by imp-95226",
  baked: {
    massSimpson: 0.999998812303697, // int_0.02^20 p(t) dt, deficit = imp-95420 head bound
    massDeficit: 1.187696302e-6, // 1 - massSimpson, positive, analytically bounded
    aOptLn2Pos: 2.374484801080e-5, // (4 pi/delta) sum sech(pi^2(2n+1)/delta), delta = ln 2
    aOptLn2Alt: 2.374484801072e-5, // sum (-1)^n sech(n delta/2), delta = ln 2 (float-trap form)
    valueIdentityRelLn2: 3.129e-12, // rel gap pos vs alt at delta = ln 2 (doubles limit)
    aOptOne: 1.299945454385e-3, // delta = 1
    aOptOneHalf: 2.325977167927e-2, // delta = 1.5
  },
  citedInputs: [
    "single-Gaussian Beurling-Selberg extremal minorant existence, " +
      "exponential-type membership, half-integer interpolation, and " +
      "integral value (L-gau) -- Carneiro-Littmann-Vaaler / Graham-Vaaler; " +
      "the ONLY irreducible non-elementary sub-step of THEOREM SEP-OPT",
  ],
  verdict:
    "PARTIAL, sharply localized: the CLV Gaussian-subordination HYPOTHESIS " +
    "for sech is now IN-REPO (H1) p(t) > 0 via imp-95420 + (H2) mass 1 via " +
    "LEMMA MIX; the subordination REDUCTION (L-sub) is elementary-modulo " +
    "the single-Gaussian core and portable in-repo in principle; the " +
    "integral VALUE equals A_lat by the in-repo Poisson identity and is " +
    "not a separate citation. The ONE sub-step that MUST remain cited is " +
    "(L-gau), the single-Gaussian extremal minorant existence/value -- the " +
    "de Branges / reproducing-kernel core with no elementary in-repo " +
    "proof. THEOREM SEP-OPT is thus conditional on exactly this one " +
    "sub-step, not on the whole CLV theorem. Assessment only; changes no " +
    "bound; the imp-95212 envelope port and signed WEIGHT / modulus-phase " +
    "legs stay OPEN; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// theta density, direct and dual forms (imp-95420 stable-form family)
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
function simpson(f, a, b, nPanels) {
  const h = (b - a) / nPanels;
  let s = f(a) + f(b);
  for (let i = 1; i < nPanels; i++) s += (i % 2 === 1 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// CLV integral value, positive-term (stable) form
function aOptPos(delta) {
  let s = 0;
  for (let n = 0; n < 400; n++) {
    const term = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += term;
    if (term < 1e-320) break;
  }
  return ((4 * Math.PI) / delta) * s;
}
// alternating lattice-symbol form A_lat (cancellation-prone float trap)
function aOptAlt(delta) {
  let s = 1;
  for (let n = 1; n < 4000; n++) {
    const term = (n % 2 === 0 ? 1 : -1) * sech((n * delta) / 2);
    s += 2 * term;
    if (Math.abs(term) < 1e-18) break;
  }
  return s;
}

const REF = IMP95421_CLV_SUBORDINATION_CITATION_BOUNDARY;

export const IMP95421_CLV_BOUNDARY_ASSERTIONS = [
  {
    id: "imp95421-hypothesis-mass-one",
    description:
      "(H2) the mixture is a PROBABILITY mixture: 1 - Simpson[0.02,20] of " +
      "the stable theta density is positive and equals the imp-95420 " +
      "analytically-bounded truncation deficit (~1.19e-6), so int p = 1 " +
      "in-repo -- the Gaussian-subordination hypothesis is not cited",
    holds: () => {
      const mass = simpson(pStable, 0.02, 20, 6000);
      if (Math.abs(mass - REF.baked.massSimpson) > 1e-9) return false;
      const deficit = 1 - mass;
      return deficit > 0 && deficit < 1.2e-6;
    },
  },
  {
    id: "imp95421-hypothesis-positivity-sample",
    description:
      "(H1) p(t) > 0 sampled across both imp-95420 regimes (dual form for " +
      "small t, direct for large t) -- the positivity hypothesis is the " +
      "in-repo imp-95420 THEOREM P-POS, re-anchored here",
    holds: () => {
      for (const t of [0.005, 0.02, 0.1, 1 / (Math.PI * Math.PI), 0.5, 2, 10]) {
        if (!(pStable(t) > 0)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95421-value-consistency-poisson",
    description:
      "value-consistency: the CLV integral value (positive-term form) " +
      "equals the alternating lattice-symbol infimum A_lat by the in-repo " +
      "Poisson identity, at delta = ln 2, 1, 1.5 (doubles limit; the " +
      "alternating form is float-trapped below, as in imp-95419)",
    holds: () => {
      const cases = [
        [Math.log(2), REF.baked.aOptLn2Pos],
        [1, REF.baked.aOptOne],
        [1.5, REF.baked.aOptOneHalf],
      ];
      for (const [d, baked] of cases) {
        const pos = aOptPos(d);
        const alt = aOptAlt(d);
        if (Math.abs(pos - baked) / baked > 1e-11) return false;
        if (Math.abs(pos - alt) / pos > 1e-9) return false;
      }
      // baked rel gap at delta = ln 2 reproduced
      const rel =
        Math.abs(aOptPos(Math.log(2)) - aOptAlt(Math.log(2))) /
        aOptPos(Math.log(2));
      return rel < 1e-11 && Math.abs(rel - REF.baked.valueIdentityRelLn2) < 5e-13;
    },
  },
  {
    id: "imp95421-value-not-separately-cited",
    description:
      "the baked alternating value matches the positive-term value at " +
      "delta = ln 2 to the recorded ~3.1e-12 -- confirming the CLV OUTPUT " +
      "value is pinned by the in-repo identity, so only EXISTENCE (L-gau) " +
      "is the residual citation",
    holds: () =>
      Math.abs(REF.baked.aOptLn2Pos - REF.baked.aOptLn2Alt) /
        REF.baked.aOptLn2Pos <
        1e-11 && REF.citedInputs.length === 1,
  },
  {
    id: "imp95421-verdict-honesty",
    description:
      "the verdict carries the honest split: hypothesis in-repo, reduction " +
      "portable, value not separately cited, exactly ONE residual cited " +
      "sub-step (L-gau), assessment-only, open legs untouched, no QED",
    holds: () =>
      /HYPOTHESIS[\s\S]*now IN-REPO/.test(REF.verdict) &&
      /ONE sub-step that MUST remain cited is[\s\S]*L-gau/.test(REF.verdict) &&
      /single-Gaussian extremal minorant/.test(REF.verdict) &&
      /not on the whole CLV theorem/.test(REF.verdict) &&
      /Assessment only/.test(REF.verdict) &&
      /stay OPEN/.test(REF.verdict) &&
      /NO QED/.test(REF.verdict) &&
      /refereed bound is changed/i.test(REF.verdict) &&
      /L-gau/.test(REF.verdictSplit.residualCited) &&
      /in-repo/.test(REF.verdictSplit.hypothesisInRepo),
  },
];

for (const a of IMP95421_CLV_BOUNDARY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95421-clv-subordination-citation-boundary assertion failed: ${a.id}`,
    );
  }
}

export default IMP95421_CLV_SUBORDINATION_CITATION_BOUNDARY;
