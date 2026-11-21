/**
 * @module imp-35297-r4-independent-model-agreement-assessment
 *
 * imp-35297 (proof, frontier-direction) -- the DEDICATED assessment of requirement R4
 * (INDEPENDENT-MODEL AGREEMENT), the ONE of the four imp-35243 surrogate-fidelity requirements for the
 * imp-34997/imp-35111 iters-to-floor REENTRY band that had no dedicated ticket. R1 (floor-independence) ->
 * imp-35263, R2 (single-rate fidelity) -> imp-35259, R3 (height-map fidelity) -> imp-35260 each already have
 * one; R4 had only the enumerating glossary headword inside imp-35243. This module gives R4 the same dedicated
 * treatment: it (i) ENUMERATES what an independent, non-log-law witness of the reentry/exit band could look
 * like, (ii) ASSESSES whether any such witness presently exists, and (iii) JUDGES whether the band therefore
 * has exactly one witness (the surrogate) and cannot be cross-validated. ASSESSMENT ONLY: it does NOT discharge
 * imp-35111a / imp-35174a / imp-35243a; the surrogate half stays OPEN; it changes no bound; NO QED.
 *
 * THE BAND AND WHY R4 IS ITS OWN QUESTION
 * ---------------------------------------
 * The reentry band is the interval of N over which the imp-35109 single-rate iters-to-floor off-by-one
 * reappears: band-on / reentry at N ~ 10^27.08, band-off / exit at N ~ 10^37.17 (width ~10.08 decades, imp-
 * 35174 double-double certified). R1/R2/R3 each ask whether ONE INTERNAL feature of the single analytic
 * surrogate (its machine-epsilon floor, its single contraction rate, its height map) is faithful to the true
 * collapse dynamic. R4 is orthogonal: it asks whether ANY SECOND, structurally-INDEPENDENT witness reproduces
 * the same band edges -- because a phenomenon confirmed by only one model, however internally consistent, is
 * un-cross-validated. R4 is the requirement that would let the band be believed WITHOUT trusting R1-R3.
 *
 * THE THREE CANDIDATE INDEPENDENT WITNESSES (ENUMERATED)
 * -----------------------------------------------------
 *  W1  A SECOND COLLAPSE MODEL. A model of the collapse dynamic NOT built from the single-rate log law
 *      g(N) = K log T0(N) with its terminal ceil against the EPS_FP = 2.3e-16 floor -- e.g. a continuous-flow
 *      or spectral model of the approach to N_CROSS_FP -- that independently predicts reentry at 10^27.08 and
 *      exit at 10^37.17. ASSESSMENT: NONE EXISTS. Every model of this collapse in the repo (imp-34755/34798/
 *      34845/34997/35109/35111/35174) is the same single-rate log law or a re-computation of it in wider
 *      arithmetic; none is architecturally independent of the terminal-ceil + EPS_FP floor that D1 shows sets
 *      the band position. No second collapse model has been constructed.
 *
 *  W2  A VERIFIED-ZERO DATUM at height N ~ 10^27 - 10^37. Direct arithmetic evidence of the true dynamic inside
 *      the band. ASSESSMENT: NONE EXISTS and it is presently UNREACHABLE. imp-35243 D2 finds no verified
 *      arithmetic datum within ~15 decades of the band: the Platt-Trudgian verified-zero height binding
 *      Lambda <= 0.2 reaches N ~ 3e12 (log10 ~ 12.48); the nearest band edge (reentry, 10^27.08) is ~14.6
 *      decades above it and the far edge (exit, 10^37.17) ~24.7 decades above it. The true dynamic in the band
 *      is not merely un-modelled but unmeasured.
 *
 *  W3  AN imp-34862 TWO-RATE RECONSTRUCTION. Refit the collapse with an early-transient rate r_0 plus the
 *      asymptotic rate r (or exact-peel the first m iterates) and check whether that reconstruction reproduces
 *      the band. ASSESSMENT: NOT INDEPENDENT -- and moreover it does not even alter the off-by-one. imp-34862
 *      tested both the ratio-fit and the exact-peel two-rate laws and found neither removes the off-by-one:
 *      the residual +/-1 lives in the TERMINAL CEIL against the EPS_FP floor, not in the transient rate. So the
 *      two-rate law shares the very machine-epsilon-floor architecture (D1) that a fidelity certificate must
 *      sever; it is a refinement of the SAME surrogate, not a second witness. Even a reproduction by it would
 *      cross-validate nothing.
 *
 * THE ASSESSMENT VERDICT
 * ----------------------
 * R4 has ZERO independent witnesses. W1 and W2 do not exist (W2 presently unreachable, ~15 decades beyond the
 * frontier); W3 is a refinement of the same log-law surrogate and shares its terminal-ceil / EPS_FP-floor
 * architecture, so it is not structurally independent. The reentry band therefore has EXACTLY ONE witness --
 * the single-rate analytic iters-to-floor surrogate -- and CANNOT be cross-validated on present evidence. R4
 * is BINDING and presently UNREACHABLE, matching the imp-35243 enumeration. This confirms imp-35243 R4 as a
 * standalone finding and does not weaken imp-35174 (whose arithmetic result stands); it bounds scope only.
 * imp-35111a / imp-35174a / imp-35243a stay OPEN.
 *
 * WHAT THIS IS AND IS NOT
 * -----------------------
 * A DEDICATED assessment of the imp-35243 R4 requirement (independent-model agreement) for the reentry band,
 * the requirement that lacked its own ticket. It enumerates three candidate witnesses and finds none is a
 * genuine independent witness. It discharges NOTHING: imp-35111a / imp-35174a / imp-34997a / imp-35243a stay
 * OPEN. ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz
 * (imp-2642/imp-2643) is UNTOUCHED; the C_mb GUE-conditional per imp-486 is UNTOUCHED; imp-3066 K_a >= 0
 * untouched; far-tail exponent stays 1/2 (imp-3463); changes no bound; establishes no operator positivity;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (enumerates R1-R4; R4 had no dedicated ticket)
 * @see imp-35263 (R1 floor-independence) / imp-35259 (R2 single-rate) / imp-35260 (R3 height-map)
 * @see imp-34862-iters-to-floor-two-rate-law (two-rate law does NOT remove the off-by-one; W3)
 * @see imp-35174-reentry-band-precision-certification (discharged the ARITHMETIC half; re-pointed imp-35174a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

// Inherited band landmarks (imp-35174 double-double certified) and the PT verified-height anchor.
const REENTRY_EXP = 27.084691; // band-on, log10 N (imp-34997/35111/35174)
const EXIT_EXP = 37.167107; // band-off, log10 N (imp-35111/35174)
const PT_VERIFIED_HEIGHT_LOG10 = Math.log10(3e12); // ~12.48 -- highest verified zero height binding Lambda<=0.2

// The witness gap: how far the NEAREST band edge sits above the highest verified zero height.
const NEAREST_EDGE_DECADES_ABOVE_VERIFIED = REENTRY_EXP - PT_VERIFIED_HEIGHT_LOG10; // ~14.6
const FAR_EDGE_DECADES_ABOVE_VERIFIED = EXIT_EXP - PT_VERIFIED_HEIGHT_LOG10; // ~24.7
const BAND_WIDTH_DECADES = EXIT_EXP - REENTRY_EXP; // ~10.08

// The three candidate independent witnesses, each with an existence + independence assessment.
const CANDIDATE_WITNESSES = [
  {
    id: 'W1',
    name: 'A second (non-log-law) collapse model',
    what: 'A model of the collapse NOT built from the single-rate log law g = K log T0(N) with a terminal ceil against the EPS_FP floor, independently predicting reentry at 10^27.08 and exit at 10^37.17.',
    exists: false,
    independent: true,
    status: 'NONE EXISTS -- every repo model of this collapse is the same single-rate log law or a wider-arithmetic recomputation of it; no architecturally independent model has been built.',
  },
  {
    id: 'W2',
    name: 'A verified-zero datum at height 10^27-10^37',
    what: 'Direct verified arithmetic evidence of the true dynamic inside the band.',
    exists: false,
    independent: true,
    status: 'NONE EXISTS / PRESENTLY UNREACHABLE -- imp-35243 D2: no verified datum within ~15 decades; nearest band edge ~14.6 decades above the ~3e12 frontier, far edge ~24.7 decades above.',
  },
  {
    id: 'W3',
    name: 'An imp-34862 two-rate reconstruction',
    what: 'Refit the collapse with an early-transient rate r_0 plus the asymptotic rate r (or exact-peel m iterates) and test whether it reproduces the band.',
    exists: true,
    independent: false,
    status: 'NOT INDEPENDENT -- imp-34862 found neither the ratio-fit nor the exact-peel two-rate law removes the off-by-one (it lives in the terminal ceil against the EPS_FP floor); it is a refinement of the SAME surrogate, sharing the machine-epsilon-floor architecture a certificate must sever.',
  },
];

const INDEPENDENT_WITNESS_COUNT = CANDIDATE_WITNESSES.filter((w) => w.exists && w.independent).length; // 0

export const IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT = {
  id: 'imp-35297',
  proofSection: 'S-frontier',
  question:
    'imp-35243 enumerated four surrogate-fidelity requirements R1-R4 for the reentry band; R1/R2/R3 each got a ' +
    'dedicated ticket (imp-35263/35259/35260) but R4 (independent-model agreement) had only the enumerating ' +
    'headword. Enumerate what an independent, non-log-law witness of the band [10^27.08, 10^37.17] could look ' +
    'like, assess whether any presently exists, and judge whether the band has exactly one witness (the ' +
    'surrogate) and cannot be cross-validated.',
  landmarks: {
    reentry_log10_N: REENTRY_EXP, // 27.084691
    exit_log10_N: EXIT_EXP, // 37.167107
    band_width_decades: +BAND_WIDTH_DECADES.toPrecision(4), // ~10.08
    pt_verified_height_log10: +PT_VERIFIED_HEIGHT_LOG10.toPrecision(5), // ~12.48 (N ~ 3e12)
    nearest_edge_decades_above_verified: +NEAREST_EDGE_DECADES_ABOVE_VERIFIED.toPrecision(4), // ~14.6
    far_edge_decades_above_verified: +FAR_EDGE_DECADES_ABOVE_VERIFIED.toPrecision(4), // ~24.7
  },
  candidate_witnesses: CANDIDATE_WITNESSES,
  independent_witness_count: INDEPENDENT_WITNESS_COUNT, // 0
  band_has_single_witness:
    'YES. R4 has ZERO independent witnesses: W1 (a second collapse model) does not exist, W2 (a verified-zero ' +
    'datum at 10^27-10^37) does not exist and is presently unreachable (~15 decades beyond the ~3e12 frontier), ' +
    'and W3 (the imp-34862 two-rate reconstruction) is not structurally independent -- it refines the SAME ' +
    'single-rate log-law surrogate and shares its terminal-ceil / EPS_FP-floor architecture, and imp-34862 ' +
    'found it does not even remove the off-by-one. So the reentry band has EXACTLY ONE witness (the analytic ' +
    'single-rate iters-to-floor surrogate) and CANNOT be cross-validated on present evidence.',
  finding:
    'Dedicated assessment of the imp-35243 R4 requirement (independent-model agreement), the one of R1-R4 with ' +
    'no prior ticket. Three candidate independent witnesses enumerated: W1 a second (non-log-law) collapse ' +
    'model -- NONE EXISTS; W2 a verified-zero datum at height 10^27-10^37 -- NONE EXISTS, presently unreachable ' +
    '(imp-35243 D2: no verified datum within ~15 decades; nearest edge ~14.6, far edge ~24.7 decades above the ' +
    '~3e12 frontier); W3 an imp-34862 two-rate reconstruction -- NOT INDEPENDENT (it refines the same log-law ' +
    'surrogate and shares the terminal-ceil / EPS_FP-floor architecture, and imp-34862 found neither the ratio-' +
    'fit nor the exact-peel two-rate law removes the off-by-one). VERDICT: R4 has ZERO independent witnesses; ' +
    'the band has exactly one witness (the surrogate) and cannot be cross-validated; R4 is BINDING and ' +
    'presently UNREACHABLE. imp-35111a / imp-35174a / imp-35243a stay OPEN.',
  residual_sub_gap:
    'R4 stays OPEN as part of imp-35243a: cross-validate the reentry band against an independent witness -- ' +
    'either construct a second, non-log-law collapse model that reproduces the band edges, or obtain a verified ' +
    'zero datum at height 10^27-10^37 (~15 decades beyond the ~3e12 frontier, presently unreachable). It ' +
    'inherits, and does not discharge, imp-35111a / imp-35174a / imp-34997a / imp-34951a.',
  isRigorous: false,
  verdict:
    'ASSESSMENT (proof-section, frontier-direction, NOT an RH bound). Dedicated treatment of the imp-35243 R4 ' +
    'requirement (independent-model agreement), which lacked its own ticket while R1/R2/R3 had imp-35263/35259/' +
    '35260. Three candidate witnesses of the reentry band [10^27.08, 10^37.17] are enumerated and assessed: a ' +
    'second (non-log-law) collapse model does NOT exist; a verified-zero datum at 10^27-10^37 does NOT exist ' +
    'and is presently unreachable (~15 decades beyond the ~3e12 frontier); the imp-34862 two-rate ' +
    'reconstruction is NOT structurally independent (same log-law surrogate, same terminal-ceil / EPS_FP-floor ' +
    'architecture, and it does not remove the off-by-one). VERDICT: R4 has ZERO independent witnesses, so the ' +
    'band has EXACTLY ONE witness (the surrogate) and cannot be cross-validated; R4 is BINDING and presently ' +
    'UNREACHABLE, confirming the imp-35243 enumeration. imp-35111a / imp-35174a / imp-35243a stay OPEN; ' +
    'imp-35174 arithmetic result is unaffected, only its scope is bounded. ASSESSMENT ONLY on the inherited ' +
    'imp-3220/imp-3406 surrogate; the C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) and the C_mb GUE-' +
    'conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463);' +
    ' changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35243 (enumerates R1-R4; R4 had no dedicated ticket); imp-35263/35259/35260 (R1/R2/R3 dedicated ' +
    'tickets); imp-34862 (two-rate law does NOT remove the off-by-one; W3); imp-35174 (discharged the ' +
    'arithmetic half; re-pointed imp-35174a); imp-34997/imp-35111 (locate the band edges); lambda-rh-height-' +
    'mapping (effectiveHeightForN RvM inverse); imp-2642 (C_C ansatz).',
};

export const IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT_ASSERTIONS = [
  {
    // The three candidate witnesses are enumerated (W1/W2/W3).
    id: 'imp35297-three-candidate-witnesses-enumerated',
    description: 'exactly three candidate witnesses W1/W2/W3 enumerated',
    holds: () =>
      CANDIDATE_WITNESSES.length === 3 &&
      CANDIDATE_WITNESSES.map((w) => w.id).join(',') === 'W1,W2,W3',
  },
  {
    // R4 has ZERO independent witnesses -- the crux of the assessment.
    id: 'imp35297-zero-independent-witnesses',
    description: 'no candidate is both existing and structurally independent (W1/W2 do not exist, W3 not independent)',
    holds: () =>
      INDEPENDENT_WITNESS_COUNT === 0 &&
      CANDIDATE_WITNESSES.find((w) => w.id === 'W1').exists === false &&
      CANDIDATE_WITNESSES.find((w) => w.id === 'W2').exists === false &&
      CANDIDATE_WITNESSES.find((w) => w.id === 'W3').independent === false,
  },
  {
    // The witness gap: the band sits ~15+ decades above any verified zero height (imp-35243 D2 restated).
    id: 'imp35297-band-far-above-verified-height',
    description: 'nearest band edge ~14.6 and far edge ~24.7 decades above the ~3e12 verified-height anchor',
    holds: () =>
      NEAREST_EDGE_DECADES_ABOVE_VERIFIED > 10 &&
      FAR_EDGE_DECADES_ABOVE_VERIFIED > 20 &&
      FAR_EDGE_DECADES_ABOVE_VERIFIED > NEAREST_EDGE_DECADES_ABOVE_VERIFIED &&
      Math.abs(NEAREST_EDGE_DECADES_ABOVE_VERIFIED - 14.6) < 0.1 &&
      Math.abs(FAR_EDGE_DECADES_ABOVE_VERIFIED - 24.7) < 0.1 &&
      Math.abs(BAND_WIDTH_DECADES - 10.08) < 0.05,
  },
  {
    // Honesty gate: assessment only, discharges nothing, no QED, no refereed bound is changed, single-witness verdict stated.
    id: 'imp35297-honesty-gate-no-qed',
    description: 'Assessment only: isRigorous false, single-witness verdict, no QED, no refereed bound is changed, sub-gap stays OPEN',
    holds: () =>
      IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT.isRigorous === false &&
      /^YES/.test(IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT.band_has_single_witness) &&
      /NO QED/.test(IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT.verdict) &&
      /imp-35243a/.test(IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT.residual_sub_gap) &&
      /imp-35111a/.test(IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT.residual_sub_gap),
  },
];

for (const a of IMP35297_R4_INDEPENDENT_MODEL_AGREEMENT_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35297-r4-independent-model-agreement-assessment assertion failed: ${a.id}`);
  }
}
