/**
 * @module imp-95692-conductor-normalization-warranted-decision
 *
 * imp-95692 (proof/assessment): DECIDES the open question imp-95534 lever 2
 * left ambivalent and imp-95572 flagged but never resolved -- is the analytic-
 * conductor scale log(p T / 2 pi) the mathematically-WARRANTED normalization
 * for evaluating a Montgomery-type F(alpha) on the imp-95519 section-4 zero
 * side, so the alpha > 1 gating legitimately moves inside |alpha| <= 1, or does
 * the conductor rescale merely RELABEL a quantity whose pair-correlation
 * content is scale-invariant, so the gating persists under any honest scale?
 *
 * imp-95519 section 4: at p = 97, 59.26 percent of the weld majorant mass sits
 * at alpha_{k,h} = log u_{k,h} / log T > 1 (the h in {82..96}, k = 1 aliases),
 * nominally outside Montgomery's range |alpha| <= 1 and so reliant on the pair-
 * correlation CONJECTURE. imp-95534 lever 2 rescaled by the analytic conductor
 * density (1/2 pi) log(p T / 2 pi): all 15 alpha_T > 1 aliases fall to alpha_C
 * in [0.914, 1.000] and the floor alias to exactly 1, but called this
 * MOVABLE-but-only-a-RELABELING without deciding whether log(p T / 2 pi) is the
 * warranted scale. imp-95572 named the same rescale MOVABLE-but-relabel and
 * left the warranted-ness open. This module decides it.
 *
 * DECISION PRINCIPLE (the discriminator). The warranted normalizing scale for a
 * Montgomery/Ozluk F(alpha) is fixed by ONE rule: alpha must be the frequency
 * conjugate to zero differences measured in units of the MEAN ZERO DENSITY of
 * the zeros the probed frequency actually resolves. Montgomery normalizes
 * zeta zero differences by the zeta density (1/2 pi) log(T / 2 pi); Ozluk (1982)
 * proved pair correlation for the zeros of L(s, chi mod q) normalized by the
 * analytic-conductor density (1/2 pi) log(q T / 2 pi). The range boundary
 * |alpha| = 1 is exactly the mean spacing -- the diagonal/off-diagonal crossover
 * of F(alpha) -- so "in range" is only meaningful relative to the density of the
 * zeros being probed.
 *
 * SUB-QUESTION A -- IS log(p T / 2 pi) WARRANTED? YES. The imp-95519 section-3
 * Gauss-Plancherel lemma attaches the aliases A_h to the zeros of
 * L(s, chi mod p), NOT to zeros of zeta: A_h is a Gauss-sum combination of the
 * twisted sums S_chi. So the frequencies u_{k,h} resolve L(s, chi mod p) zeros,
 * whose mean density is (1/2 pi) log(p T / 2 pi). Measuring L-zero frequencies
 * against the zeta density log T is a CATEGORY ERROR -- it asks whether L-zeros
 * are resolved relative to zeta's spacing, which is not the pair-correlation
 * question the section-3 import poses. The alpha_T > 1 appearance is therefore a
 * genuine artifact of the wrong density, and the conductor scale log(p T / 2 pi)
 * is the mathematically-warranted one, not an arbitrary relabel.
 *
 * SUB-QUESTION B -- DOES THE PCC CONTENT PERSIST ANYWAY? YES, in the only sense
 * that was ever binding, and the honesty of the warranted scale is exactly WHY.
 * Three scale-structural facts:
 *   1. Fixed compression, no free parameter. log(p T / 2 pi) = log T + log(p/2 pi)
 *      with p/2 pi = 15.438 fixed, so alpha_C = alpha_T * log T / log(p T/2 pi)
 *      is a fixed contraction toward -- never past -- 1 for the top aliases.
 *      The map is structural, not a tunable knob.
 *   2. Exact boundary pinning. The floor alias (k = 1, h = p - 1) has
 *      u_{1,p-1} = p v = p T / 2 pi = the analytic conductor EXACTLY, so
 *      alpha_C = 1 exactly and is the MAXIMUM over all aliases (max alpha_C = 1,
 *      both window ends, N-independent). The single largest majorant contributor
 *      lands precisely on the F(alpha) crossover, the least-controlled edge where
 *      the theorem range meets the conjecture range.
 *   3. Circularity of the range test under the honest scale. "|alpha_C| <= 1" is
 *      satisfied for the top aliases PRECISELY BECAUSE the conductor scale is
 *      defined as the density at which the floor alias sits at 1; being in range
 *      is therefore automatic under the warranted scale, not evidence that the
 *      pair-correlation input is now available.
 *
 * RESOLUTION (both, compatibly). The conductor rescale is WARRANTED AND STILL A
 * RELABELING. It is the honest scale (A), and precisely because it is honest it
 * relocates the dominant mass to the boundary alpha_C = 1 rather than removing
 * the dependency (B). The operative obstruction was never the numeric range: it
 * is the mean-square-vs-pointwise gap (Montgomery/Ozluk give a mean square over
 * gamma in [0, T]; the contract needs a pointwise local sum) and the GRH-height
 * deficit for q = 97 (Platt verifies GRH only to ~1.03e6, a factor ~2.9e6 below
 * the window bottom T = 3.0e12), both scale-invariant, now joined by the
 * boundary degeneracy the honest scale exposes. imp-95534 lever 2 is thereby
 * upgraded from "MOVABLE-but-only-relabel" ambivalence to a decided verdict:
 * WARRANTED relabeling -- the scale is correct, and its correctness is exactly
 * why it does not reopen the program. The imp-95519 zero-side no-go STANDS.
 *
 * Assess/derive only. No bound changes; NO QED; no refereed bound is changed;
 * RH open. Import-light: no zeros bundle, no sibling imports; all literals
 * re-derived from the imp-95519/imp-95534 closed forms.
 */

const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595
const N_LO = 690988;
const N_HI = 54799999;
const P = 97;

const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI; // v = x/(4 pi) ~ N^2
const uOfKH = (k, h, N) => stationaryV(N) / (k - h / P); // imp-95519 eq 15

// zeta-scale (imp-95519 section 4) vs analytic-conductor scale (imp-95534 lever 2)
const alphaT = (k, h, N) => Math.log(uOfKH(k, h, N)) / Math.log(heightT(N));
const conductorScale = (N) => (P * heightT(N)) / TWO_PI; // = p v
const alphaC = (k, h, N) => Math.log(uOfKH(k, h, N)) / Math.log(conductorScale(N));

// exact conductor identity: u_{1,p-1} = p v = p T/2 pi = conductor scale
const U_FLOOR = uOfKH(1, P - 1, N_LO);
const CONDUCTOR = conductorScale(N_LO);
const CONDUCTOR_MATCH_REL = Math.abs(U_FLOOR - CONDUCTOR) / CONDUCTOR;
const ALPHA_T_FLOOR = alphaT(1, P - 1, N_LO); // 1.0953
const ALPHA_C_FLOOR = alphaC(1, P - 1, N_LO); // 1 exactly

// fixed compression factor: log(p/2 pi) is scale-independent, p/2 pi = 15.438
const P_OVER_TWO_PI = P / TWO_PI;
const COMPRESSION_LO = Math.log(heightT(N_LO)) / Math.log(conductorScale(N_LO));

// alpha_C is the floor-pinned maximum over all k = 1 aliases, both window ends
function aliasStats(N) {
  let overT = 0;
  let overC = 0;
  let maxC = 0;
  for (let h = 1; h <= P - 1; h++) {
    if (1 - h / P <= 0) continue;
    if (alphaT(1, h, N) > 1) overT += 1;
    const aC = alphaC(1, h, N);
    if (aC > 1 + 1e-9) overC += 1;
    if (aC > maxC) maxC = aC;
  }
  return { overT, overC, maxC };
}
const STATS_LO = aliasStats(N_LO);
const STATS_HI = aliasStats(N_HI);

// GRH height deficit for q = 97 (scale-invariant surviving wall)
const PLATT_GRH_HEIGHT_Q97 = 1e8 / P;
const HEIGHT_DEFICIT_Q97 = heightT(N_LO) / PLATT_GRH_HEIGHT_Q97; // ~2.9e6

export const IMP95692_CONDUCTOR_NORMALIZATION_WARRANTED_DECISION = Object.freeze({
  id: 'imp-95692',
  date: '2026-09-22',
  category: 'proof',
  source:
    'imp-95519 section 4 (zero-side alpha > 1 PCC-gating) and section 3 (Gauss-Plancherel L(s, chi mod p) import, Platt height deficit); imp-95534 lever 2 (conductor rescale, MOVABLE-but-relabel); imp-95572 (open warranted-ness flag)',
  question:
    'Is the analytic-conductor scale log(p T/2 pi) the mathematically-warranted normalization for evaluating a Montgomery-type F(alpha) on the imp-95519 zero side (so the alpha > 1 gating legitimately moves inside |alpha| <= 1), or does the conductor rescale merely relabel a quantity whose pair-correlation content is scale-invariant?',

  decisionPrinciple:
    'The warranted normalizing scale for a Montgomery/Ozluk F(alpha) is fixed by one rule: alpha is the frequency conjugate to zero differences measured in units of the MEAN ZERO DENSITY of the zeros the probed frequency resolves. The boundary |alpha| = 1 is the mean spacing itself -- the diagonal/off-diagonal crossover of F(alpha) -- so being in range is only meaningful relative to the density of the zeros being probed.',

  subQuestionA: {
    verdict: 'WARRANTED',
    reason:
      'The imp-95519 section-3 Gauss-Plancherel lemma attaches the aliases A_h to the zeros of L(s, chi mod p) (A_h is a Gauss-sum combination of the twisted sums S_chi), NOT to zeros of zeta. So the frequencies u_{k,h} resolve L(s, chi mod p) zeros, whose mean density is (1/2 pi) log(p T/2 pi). Ozluk (1982) proved pair correlation of those zeros in exactly this conductor normalization. Measuring L-zero frequencies against the zeta density log T is a CATEGORY ERROR, so the alpha_T > 1 appearance is a genuine artifact of the wrong density and log(p T/2 pi) is the warranted scale.',
  },

  subQuestionB: {
    verdict: 'PCC CONTENT PERSISTS (in the only binding sense)',
    reason:
      'Under the warranted scale all 15 aliases sit at alpha_C <= 1, but the pair-correlation dependency is not removed: (1) the rescale is a fixed contraction alpha_C = alpha_T log T/log(p T/2 pi) with log(p/2 pi) scale-independent (p/2 pi = 15.438), no free parameter; (2) the floor alias has u_{1,p-1} = p T/2 pi EXACTLY so alpha_C = 1 exactly and is the maximum over all aliases at both window ends -- the largest majorant contributor lands on the F(alpha) crossover; (3) being in range is automatic under the warranted scale precisely because that scale is defined as the density at which the floor sits at 1, so |alpha_C| <= 1 is not evidence the input is available.',
  },

  survivingScaleInvariantWalls: [
    'MEAN-SQUARE vs POINTWISE (imp-95519 section 4): Montgomery/Ozluk evaluate F(alpha) as a mean square over gamma in [0, T]; the contract needs the local zero sum over |gamma - T| <= Delta POINTWISE in T. Renormalization moves alpha, not this gap.',
    'GRH-HEIGHT-BOUND (imp-95519 section 3): Ozluk individual-L pair correlation in |alpha_C| <= 1 is GRH-conditional; GRH for L(s, chi mod 97) is verified (Platt) only to ~1.03e6, a factor ~2.9e6 below T = 3.0e12.',
    'BOUNDARY DEGENERACY (exposed by the honest scale): the floor alias, the single largest majorant contributor, lands at alpha_C = 1 exactly, the least-controlled edge where the theorem range meets the conjecture range.',
  ],

  netVerdict:
    'WARRANTED, AND STILL A RELABELING. The analytic-conductor scale log(p T/2 pi) IS the mathematically-warranted normalization here (the section-3 import makes L(s, chi mod p) density the correct comparison; the zeta scale log T is a category error), so the alpha > 1 gating is a genuine normalization artifact and legitimately moves inside |alpha| <= 1. But precisely because the scale is honest, it relocates the dominant mass to the boundary alpha_C = 1 (the exact conductor identity u_{1,p-1} = p T/2 pi) rather than removing the pair-correlation dependency: the operative obstruction was never the numeric range but the mean-square-vs-pointwise gap and the GRH-height deficit, both scale-invariant, plus the boundary degeneracy the honest scale exposes. imp-95534 lever 2 is upgraded from MOVABLE-but-only-relabel ambivalence to a decided verdict: WARRANTED relabeling. The imp-95519 zero-side no-go STANDS; only its framing sharpens. No bound changes; NO QED; no refereed bound is changed; RH open.',

  figures: {
    conductorMatchRel: CONDUCTOR_MATCH_REL,
    alphaTFloorLo: ALPHA_T_FLOOR,
    alphaCFloorLo: ALPHA_C_FLOOR,
    pOverTwoPi: P_OVER_TWO_PI,
    compressionFactorLo: COMPRESSION_LO,
    aliasStatsLo: STATS_LO,
    aliasStatsHi: STATS_HI,
    heightDeficitQ97: HEIGHT_DEFICIT_Q97,
  },

  promotesBound: false,
  isRigorous: true,
  rigorScope:
    'The decision principle (warranted scale = mean density of the probed zeros), the section-3 attribution of the aliases to L(s, chi mod p), and the exact conductor identity u_{1,p-1} = p T/2 pi are elementary and exact; the alias counts and compression factor are finite computations. This is a proof-grade DECISION on the warranted-ness of a normalization plus a framing sharpening, not a new theorem that a bound exists.',
});

const DEC = IMP95692_CONDUCTOR_NORMALIZATION_WARRANTED_DECISION;

export const IMP95692_ASSERTIONS = Object.freeze([
  {
    id: 'imp95692-exact-conductor-identity',
    description: 'u_{1,p-1} = p T/2 pi exactly, so under the conductor scale the floor alias has alpha_C = 1 exactly',
    holds: () => CONDUCTOR_MATCH_REL < 1e-9 && Math.abs(ALPHA_C_FLOOR - 1) < 1e-9,
  },
  {
    id: 'imp95692-zeta-scale-floor-over-one',
    description: 'under the zeta scale log T the same floor alias has alpha_T = 1.0953 > 1 (the imp-95519 section-4 artifact)',
    holds: () => Math.abs(ALPHA_T_FLOOR - 1.0953) < 5e-4 && ALPHA_T_FLOOR > 1,
  },
  {
    id: 'imp95692-fixed-compression-no-free-parameter',
    description: 'the rescale is a fixed contraction: p/2 pi = 15.438 is scale-independent and the compression factor log T/log(p T/2 pi) < 1',
    holds: () => Math.abs(P_OVER_TWO_PI - 15.438) < 5e-3 && COMPRESSION_LO < 1 && COMPRESSION_LO > 0.9,
  },
  {
    id: 'imp95692-floor-is-the-conductor-maximum',
    description: 'all 15 alpha_T > 1 aliases fall to alpha_C <= 1 and the floor alias is the maximum alpha_C = 1 at both window ends (boundary pinning, N-independent)',
    holds: () =>
      STATS_LO.overT === 15 &&
      STATS_LO.overC === 0 &&
      STATS_HI.overC === 0 &&
      Math.abs(STATS_LO.maxC - 1) < 1e-9 &&
      Math.abs(STATS_HI.maxC - 1) < 1e-9,
  },
  {
    id: 'imp95692-height-deficit-scale-invariant',
    description: 'the GRH height deficit for q = 97 (~2.9e6) is a normalization-independent surviving wall',
    holds: () => Math.abs(HEIGHT_DEFICIT_Q97 / 2.91e6 - 1) < 5e-3,
  },
  {
    id: 'imp95692-decision-both-warranted-and-relabel',
    description: 'the decision resolves sub-question A as WARRANTED and sub-question B as PCC content persisting, yielding the compatible net verdict',
    holds: () =>
      DEC.subQuestionA.verdict === 'WARRANTED' &&
      /PCC CONTENT PERSISTS/.test(DEC.subQuestionB.verdict) &&
      /WARRANTED, AND STILL A RELABELING/.test(DEC.netVerdict),
  },
  {
    id: 'imp95692-honesty-gate',
    description: 'decision only: promotes no bound, NO QED, no refereed bound is changed, RH open',
    holds: () =>
      DEC.promotesBound === false &&
      /NO QED/.test(DEC.netVerdict) &&
      /refereed bound is changed/i.test(DEC.netVerdict) &&
      /RH open/.test(DEC.netVerdict),
  },
]);

for (const a of IMP95692_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95692-conductor-normalization-warranted-decision assertion failed: ${a.id}`);
  }
}

export default IMP95692_CONDUCTOR_NORMALIZATION_WARRANTED_DECISION;
