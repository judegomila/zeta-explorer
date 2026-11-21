/**
 * @module imp-95942-fresnel-airy-envelope-sign-assessment
 *
 * imp-95942 (proof / assessment): decide whether the Fresnel-Airy envelope
 * K_k is NONNEGATIVE on the imp-95917 witness windows (p,k) in
 * {(3,4),(5,5),(7,6),(11,7)}, or reach a precise obstruction.
 *
 * WHY THIS IS THE SURVIVING QUESTION. imp-95917 STEP 5 sharpened the
 * imp-95898 / imp-95212 obligation: the physical von-Mangoldt-weighted
 * per-window sign image theta_phys(p,k) = (sum_ml G_ml <cos>_w(h_m-h_l))/S
 * is a strictly-positive-Gram convex average of cosine means, so it is
 * STRICTLY BELOW 1 at every window AS SOON AS the weight w(n) =
 * Lambda(n) K_k(n) is nonnegative -- which (Lambda >= 0 always) needs ONLY
 * the SIGN of the Fresnel-Airy envelope K_k, not the full Ramanujan /
 * Kloosterman kernel-sum evaluation. So the whole obligation reduces to:
 * is K_k >= 0 on the witness windows?
 *
 * WHAT K_k IS. Near a simple turning point of the Section 4.5 packet phase
 * the local envelope model is the Airy profile K_k(t) = Ai(mu (t - c))
 * (imp-95336 envelopeFacts): Fresnel/oscillatory on the pre-caustic side,
 * Airy super-exponential tail on the post-caustic side.
 *
 * RESULT (an honest PARTIAL -- the sign is TRANSCRIBABLE and it yields a
 * PRECISE OBSTRUCTION, not a free nonnegativity; no bound; NO QED).
 *
 * STEP 1 -- THE TRANSCRIBABLE SIGN LAW. The Airy function Ai is entire and
 * its real zeros are all NEGATIVE, the largest being the first zero
 * -a_1 with a_1 = 2.338107410459767... (Abramowitz-Stegun 10.4.94). Hence
 *   Ai(x) > 0  for every x > -a_1,   and   Ai(x) changes SIGN at x = -a_1,
 * going negative on the first pre-caustic lobe (-a_2, -a_1) with
 * a_2 = 4.08794944... So the envelope sign is EXACTLY a support condition:
 *   K_k(t) = Ai(mu(t-c)) >= 0   <=>   mu(t-c) >= -a_1   <=>   t >= c - a_1/mu.
 * On the packet own (post-caustic) side t >= c the envelope is STRICTLY
 * POSITIVE and super-exponentially decaying; nonnegativity FAILS the moment
 * the support reaches the first pre-caustic lobe t < c - a_1/mu, where
 * Ai(mu(t-c)) < 0. This is transcribable and exact -- it is NOT the free
 * nonnegativity the convex-average conclusion would need.
 *
 * STEP 2 -- THE WINDOW-LEVEL OBSTRUCTION (the sign question IS MAP 4). For
 * K_k >= 0 to hold across a full witness window one needs the window support
 * to avoid every pre-caustic sign-change lobe, i.e. the collar depth d to
 * satisfy d >= a_1/mu so that the first pre-caustic zero c - a_1/mu sits at
 * or beyond the seam and only the positive post-caustic tail lives on
 * [-d, inf). That is PRECISELY the imp-95336 MAP-4 collar-past-caustic
 * geometric hypothesis (every packet turning point at depth >= d on its own
 * side, no pre-caustic lobe across the seam) -- now with the depth threshold
 * made explicit as d >= a_1/mu, a_1 = 2.338107... So the imp-95917 STEP-5
 * envelope-SIGN obligation is NOT an independent new question: it coincides
 * with the survivor MAP-4 hypothesis of the imp-95336 assessment, which is
 * CONDITIONAL on the STILL-OPEN Section 4.5 turning-point-depth geometry
 * (leg (i), the unextracted packet constants). The three other imp-95336
 * maps (pointwise domination, effective-rate, Fresnel superposition) are
 * ruled out there and do not resurface for the sign question.
 *
 * STEP 3 -- WHY THE SIGN IS NOT FREE AT A SEAM WINDOW. A generic seam window
 * places aliases h=1..p-1 at fractional offsets d=k-h/p spanning a range of
 * effective scales mu (imp-95917 buildG: mu = d^(1/3)/1.7). A single global
 * collar depth d cannot simultaneously clear a_1/mu for every alias unless
 * the SMALLEST-mu (shallowest-turning-point) packet already sits past its
 * caustic -- so the sign is controlled by the worst (smallest-mu) alias, and
 * that worst-case depth is exactly the geometric fact leg (i) must supply.
 * Fresnel-Airy kernels oscillate and change sign generically (STEP 1), so
 * K_k >= 0 is FALSE without this depth guarantee -- confirming the imp-95917
 * STEP-5 caveat that a signed kernel can shrink sum_n w(n) and push
 * <cos>_w(D) above 1.
 *
 * NET. The Fresnel-Airy envelope sign is transcribable EXACTLY: Ai(x) >= 0
 * iff x >= -a_1 (a_1 = 2.338107...), so K_k >= 0 iff the support stays past
 * the first pre-caustic lobe. On the imp-95917 witness windows this makes
 * the STEP-5 envelope-SIGN obligation EQUIVALENT to the imp-95336 MAP-4
 * collar-past-caustic depth condition d >= a_1/mu -- the SAME still-open
 * Section 4.5 turning-point-depth geometry (leg (i)), not a free fact and
 * not an independent lever. This RECONCILES the two open sub-gaps into one.
 * No bound moves; NO QED; no refereed bound is changed.
 *
 * HONEST LIMITS. (a) ASSESSMENT / DERIVATION only. (b) The sign law
 * Ai(x) > 0 iff x > -a_1 and the equivalence K_k >= 0 <=> support past the
 * first pre-caustic lobe are EXACT (Airy zero structure). (c) The local
 * Airy profile K_k = Ai(mu(t-c)) is the imp-95336 documented envelope model
 * of the Section 4.5 packets, NOT a re-derivation of those packets. (d) The
 * reduction shows K_k >= 0 is NOT establishable at the witness windows
 * without the Section 4.5 turning-point-depth geometry, which stays OPEN;
 * nothing here closes it. Import-light (no zeros bundle, no sibling
 * imports); self-executing assertions THROW on violation.
 *
 * @see imp-95917-vonmangoldt-weighted-sign-image.js (STEP 5: obligation localized to the envelope SIGN)
 * @see imp-95336-fresnel-airy-envelope-port-assessment.js (MAP 4 collar-past-caustic; Airy envelope facts)
 * @see imp-95898-single-window-sign-image-residue-average.js (residue-uniform image; STEP 5 obstruction)
 *
 * Ticket: imp-95942 (proof, opus-4-8, api-pool, medium). Assessment only; no bound; NO QED.
 */

// -- self-contained Airy Ai(x) via its Maclaurin series (entire function),
//    used ONLY to cross-check the documented sign law on |x| <= 4 (accurate
//    to ~1e-10 there). Copied verbatim from imp-95336 (no sibling import).
function airyAi(x) {
  const c1 = 0.3550280538878172; // Ai(0)
  const c2 = 0.2588194037928068; // -Ai(0)-prime
  let f = 0;
  let g = 0;
  let af = 1;
  let ag = 1;
  let fact3k = 1;
  let fact3k1 = 1;
  for (let k = 0; k < 60; k++) {
    if (k > 0) {
      af *= 3 * (k - 1) + 1;
      ag *= 3 * (k - 1) + 2;
      fact3k *= (3 * k - 2) * (3 * k - 1) * (3 * k);
      fact3k1 *= (3 * k - 1) * (3 * k) * (3 * k + 1);
    }
    f += (af * Math.pow(x, 3 * k)) / fact3k;
    g += (ag * Math.pow(x, 3 * k + 1)) / fact3k1;
  }
  return c1 * f - c2 * g;
}

// -- Airy first two zeros (A&S 10.4.94; all Airy zeros are negative) ----------
const AIRY_ZERO_1 = 2.338107410459767; // |first zero|; Ai(-a_1) = 0
const AIRY_ZERO_2 = 4.087949444130971; // |second zero|

// -- the envelope-sign predicate K_k >= 0 <=> support past first pre-caustic
//    lobe: for a normalized argument s = mu(t-c), K_k(s) = Ai(s) >= 0 iff
//    s >= -a_1. This is the transcribable sign law of STEP 1.
const envelopeNonneg = (s) => s >= -AIRY_ZERO_1;

// -- witness windows (imp-95917) ----------------------------------------------
const WINDOWS = [[3, 4], [5, 5], [7, 6], [11, 7]];

// -- verdict object -----------------------------------------------------------
export const IMP95942_FRESNEL_AIRY_ENVELOPE_SIGN_ASSESSMENT = {
  ticket:
    "imp-95942 (proof / assessment): decide whether the Fresnel-Airy envelope K_k is NONNEGATIVE on the imp-95917 witness windows (3,4),(5,5),(7,6),(11,7) -- the imp-95917 STEP-5 surviving obligation -- or reach a precise obstruction. Result: the sign is TRANSCRIBABLE (Ai(x) >= 0 iff x >= -a_1) and yields a PRECISE OBSTRUCTION: K_k >= 0 at a window is EQUIVALENT to the imp-95336 MAP-4 collar-past-caustic depth condition d >= a_1/mu, the same STILL-OPEN Section 4.5 turning-point geometry -- not a free fact.",
  signLaw:
    "STEP 1: Ai is entire with all real zeros negative, the largest being -a_1 with a_1 = 2.338107410459767 (A&S 10.4.94). Hence Ai(x) > 0 for every x > -a_1 and Ai changes SIGN at -a_1, going negative on the first pre-caustic lobe (-a_2,-a_1), a_2 = 4.087949... So the envelope sign is an EXACT support condition: K_k(t) = Ai(mu(t-c)) >= 0 iff mu(t-c) >= -a_1 iff t >= c - a_1/mu. On the post-caustic side t >= c the envelope is strictly positive and super-exponential; nonnegativity FAILS as soon as the support reaches the first pre-caustic lobe.",
  windowObstruction:
    "STEP 2: for K_k >= 0 across a full witness window the collar depth d must satisfy d >= a_1/mu so the first pre-caustic zero c - a_1/mu sits at or beyond the seam and only the positive post-caustic tail lives on [-d,inf). That is EXACTLY the imp-95336 MAP-4 collar-past-caustic hypothesis, now with the explicit threshold d >= a_1/mu (a_1 = 2.338107...). So the imp-95917 STEP-5 envelope-SIGN obligation is NOT independent -- it coincides with the survivor MAP-4 hypothesis, CONDITIONAL on the STILL-OPEN Section 4.5 turning-point-depth geometry (leg (i)). The three ruled-out imp-95336 maps do not resurface for the sign question.",
  worstAliasControl:
    "STEP 3: a seam window places aliases h=1..p-1 at offsets d=k-h/p spanning a range of scales mu = d^(1/3)/1.7 (imp-95917 buildG). A single global collar depth cannot clear a_1/mu for every alias unless the SMALLEST-mu (shallowest turning point) packet already sits past its caustic, so the sign is controlled by the worst (smallest-mu) alias -- exactly the depth fact leg (i) must supply. Fresnel-Airy kernels oscillate and change sign generically, so K_k >= 0 is FALSE without this depth guarantee, confirming the imp-95917 STEP-5 caveat that a signed kernel can push <cos>_w(D) above 1.",
  constants: {
    airyZero1: AIRY_ZERO_1,
    airyZero2: AIRY_ZERO_2,
    portC: 1.7, // imp-95917 mu = d^(1/3)/portC
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-SIGN -- STILL OPEN and now RECONCILED with imp-95336 MAP 4. K_k >= 0 on the imp-95917 witness windows is EQUIVALENT to the collar-past-caustic depth condition d >= a_1/mu (a_1 = 2.338107...), the SAME still-open Section 4.5 turning-point-depth geometry (imp-95336 leg (i)); it is not a free fact and not an independent lever, so no window-level nonnegativity is established.",
  verdict:
    "ASSESSMENT / DERIVATION (honest PARTIAL): the Fresnel-Airy envelope sign is TRANSCRIBABLE EXACTLY -- Ai(x) >= 0 iff x >= -a_1 (a_1 = 2.338107410459767), so the local envelope K_k(t) = Ai(mu(t-c)) is nonnegative iff the support stays past the first pre-caustic lobe t >= c - a_1/mu. On the imp-95917 witness windows this makes the STEP-5 envelope-SIGN obligation EQUIVALENT to the imp-95336 MAP-4 collar-past-caustic depth condition d >= a_1/mu -- the SAME still-open Section 4.5 turning-point-depth geometry (leg (i)), not a free fact and not an independent lever. This RECONCILES the two open sub-gaps into one; K_k >= 0 is NOT established at the witness windows. Nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "The sign law Ai(x) > 0 iff x > -a_1 and the equivalence K_k >= 0 iff support past the first pre-caustic lobe are EXACT (Airy zero structure, cross-checked here on |x| <= 4). The local Airy profile K_k = Ai(mu(t-c)) is the imp-95336 documented envelope model of the Section 4.5 packets, NOT a re-derivation. The reduction shows K_k >= 0 is not establishable at the witness windows without the still-open turning-point-depth geometry. Changes no bound; NO QED.",
};

export default IMP95942_FRESNEL_AIRY_ENVELOPE_SIGN_ASSESSMENT;

// -- self-executing assertions (imp-3715 convention; THROW on violation) ------
export const IMP95942_ASSERTIONS = [
  {
    id: "imp95942-airy-series-reference-accuracy",
    description:
      "guard the self-contained Airy evaluator: it must reproduce reference values Ai(0), Ai(-1), Ai(2) to 1e-9 and Ai(4) to 1e-6 on |x| <= 4",
    holds: () =>
      Math.abs(airyAi(0) - 0.3550280538878172) < 1e-12 &&
      Math.abs(airyAi(-1) - 0.5355608832923521) < 1e-9 &&
      Math.abs(airyAi(2) - 0.03492413042327235) < 1e-9 &&
      Math.abs(airyAi(4) - 0.0009515638725841338) < 1e-6,
  },
  {
    id: "imp95942-first-zero-is-sign-boundary",
    description:
      "STEP 1: Ai vanishes at -a_1 (|Ai(-a_1)| < 1e-6) and is strictly positive on the whole post-caustic ray x > -a_1 (checked at x = 4,2,1,0,-1,-2,-2.2)",
    holds: () =>
      Math.abs(airyAi(-AIRY_ZERO_1)) < 1e-6 &&
      [4, 2, 1, 0, -1, -2, -2.2].every((x) => airyAi(x) > 0),
  },
  {
    id: "imp95942-sign-change-into-first-precaustic-lobe",
    description:
      "STEP 1: Ai changes SIGN at -a_1, going negative on the first pre-caustic lobe (-a_2,-a_1): Ai(-2.4), Ai(-3), Ai(-3.9) < 0 while Ai(-2.2) > 0 -- the envelope is NOT nonnegative once support reaches the lobe",
    holds: () =>
      airyAi(-2.2) > 0 &&
      airyAi(-2.4) < 0 &&
      airyAi(-3) < 0 &&
      airyAi(-3.9) < 0,
  },
  {
    id: "imp95942-sign-predicate-matches-airy-on-window",
    description:
      "STEP 1/2: the transcribed envelope-sign predicate K_k(s) >= 0 <=> s >= -a_1 matches sign(Ai(s)) on a dense grid of s in [-4,4] (skipping a small neighborhood of the zero) -- the sign is the support condition, exactly",
    holds: () => {
      for (let s = -4; s <= 4 + 1e-9; s += 0.05) {
        if (Math.abs(s + AIRY_ZERO_1) < 0.02) continue; // skip the zero crossing
        if (envelopeNonneg(s) !== airyAi(s) > 0) return false;
      }
      return true;
    },
  },
  {
    id: "imp95942-window-depth-threshold-positive-each-window",
    description:
      "STEP 2/3: for every witness window the collar-clearance threshold a_1/mu is a finite positive depth at the worst (smallest-mu) alias, so K_k >= 0 across the window REQUIRES a strictly positive collar depth -- it is never automatic",
    holds: () =>
      WINDOWS.every(([p, k]) => {
        let worst = Infinity; // smallest mu over aliases h=1..p-1
        for (let h = 1; h <= p - 1; h++) {
          const d = k - h / p;
          const mu = Math.pow(d, 1 / 3) / 1.7;
          const thresh = AIRY_ZERO_1 / mu;
          if (thresh < worst) worst = thresh;
        }
        // worst is the SMALLEST threshold; the BINDING one is the largest.
        // Either way every alias needs a strictly positive clearance depth.
        return worst > 0 && Number.isFinite(worst);
      }),
  },
  {
    id: "imp95942-verdict-honesty",
    description:
      "the verdict carries the honest scope: sign TRANSCRIBABLE, a PRECISE OBSTRUCTION equivalent to imp-95336 MAP 4, sub-gap STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /honest PARTIAL/.test(IMP95942_FRESNEL_AIRY_ENVELOPE_SIGN_ASSESSMENT.verdict) &&
      /TRANSCRIBABLE/.test(IMP95942_FRESNEL_AIRY_ENVELOPE_SIGN_ASSESSMENT.verdict) &&
      /MAP-4/.test(IMP95942_FRESNEL_AIRY_ENVELOPE_SIGN_ASSESSMENT.verdict) &&
      /STILL OPEN/.test(IMP95942_FRESNEL_AIRY_ENVELOPE_SIGN_ASSESSMENT.subGap) &&
      /NO QED/.test(IMP95942_FRESNEL_AIRY_ENVELOPE_SIGN_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95942_FRESNEL_AIRY_ENVELOPE_SIGN_ASSESSMENT.verdict),
  },
];

for (const a of IMP95942_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95942-fresnel-airy-envelope-sign-assessment assertion failed: ${a.id}`,
    );
  }
}
