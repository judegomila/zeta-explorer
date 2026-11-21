/**
 * imp-95534 - Can the imp-95519 zero-side alpha_{k,h} > 1 PCC-gating be pulled
 * in-range by a different Fresnel width or Montgomery normalization, or is it rigid?
 *
 * imp-95519 section 4 finds that at p = 97, 59.26 percent of the weld majorant
 * mass (the h in {82..96}, k = 1 aliases) sits at
 *     alpha_{k,h} = log u_{k,h} / log T = 1 + log(1/(2 pi (k - h/p))) / log T > 1,
 * outside the range |alpha| <= 1 where Montgomery's theorem evaluates F(alpha)
 * on RH, forcing reliance on the pair-correlation CONJECTURE proper. This module
 * ASSESSES the two named levers the ticket asks about - Fresnel width and
 * normalization - and reports which is rigid and which is a relabeling. Report
 * only: no bound changes, no refereed bound is changed, RH open, NO QED.
 *
 * LEVER 1 - FRESNEL WIDTH: RIGID (exact). The frequency alpha_{k,h} is a function
 * of the stationary-point LOCATION u_{k,h} = v/(k - h/p) alone. That location is
 * pinned by phase stationarity: the phase phi(u) = -(T/2 pi) log u + (h/p - k) u
 * has phi-prime(u) = 0 exactly at u_{k,h}, independent of the packet amplitude or
 * window shape. The Fresnel width H_{k,h} = u_{k,h}/sqrt(v) sets only the packet
 * RESOLUTION Delta = u/H = sqrt(v) - the second-derivative scale - and does not
 * enter u, hence does not enter alpha. Any window (Gaussian, Airy-at-a-saddle,
 * box) sharing the same stationary phase has the SAME u and the SAME alpha. So no
 * choice of Fresnel width moves any alias in or out of the Montgomery range: the
 * alpha values, and the 59.26 percent alpha > 1 majorant share, are width-rigid.
 * (This is the width analogue of the imp-95542 abscissa-invariance of alpha.)
 *
 * LEVER 2 - NORMALIZATION: MOVABLE, but as a RELABELING, not a rescue. The
 * section-3 Gauss-Plancherel lemma shows the aliases A_h import the zeros of
 * L(s, chi mod p), p <= 97 (A_h is a Gauss-sum combination of the twisted sums
 * S_chi). The canonical pair-correlation frequency for zeros of L(s, chi mod p)
 * at height T is normalized by the ANALYTIC CONDUCTOR density (1/2 pi) log(p T/2 pi),
 * i.e. alpha_C = log u_{k,h} / log(p T/2 pi), NOT by the zeta scale log T that
 * imp-95519 section 4 uses. Under alpha_C:
 *   - the floor alias (k = 1, h = p - 1) has u_{1,p-1} = v/(1/p) = p v = p T/2 pi
 *     EXACTLY the analytic conductor, so alpha_C = 1 exactly. This is not a
 *     coincidence: the largest alias frequency of the mod-p sieve (k = 1, h -> p)
 *     is precisely the conductor scale, because the alias shift h/p -> 1 and the
 *     Poisson mode k = 1 push the stationary point to p v.
 *   - all 15 alpha > 1 aliases (h in {82..96}) move to alpha_C in [0.914, 1.000],
 *     i.e. INTO the range |alpha_C| <= 1 of the Montgomery/Ozluk evaluation for
 *     Dirichlet L-functions (Ozluk proved the pair correlation of zeros of
 *     L(s, chi) in this normalization).
 * So the alpha > 1 appearance is, at bottom, an ARTIFACT of measuring the mod-p
 * alias frequencies against the zeta scale log T rather than the L(s, chi mod p)
 * conductor scale log(p T) that the section-3 import actually attaches to them.
 *
 * WHY THE RELABELING DOES NOT REOPEN THE PROGRAM. The alpha-range was never the
 * binding obstruction; three independent walls survive the conductor rescaling:
 *   (i)  MEAN-SQUARE vs POINTWISE (imp-95519 section 4, unchanged). Even in range,
 *        Montgomery/Ozluk evaluate F(alpha) as a MEAN SQUARE over gamma in [0, T],
 *        while the contract needs the LOCAL zero sum over |gamma - T| <= Delta,
 *        POINTWISE in T, uniformly over the continuous window parameter - the
 *        pointwise Hilbert transform of the zero-counting measure. Renormalization
 *        moves alpha but not the mean-square-to-pointwise gap.
 *   (ii) GRH-HEIGHT-BOUND (imp-95519 section 3, unchanged). Ozluk's individual-L
 *        pair correlation in |alpha_C| <= 1 is itself GRH-conditional; GRH for
 *        L(s, chi mod 97) is verified (Platt) only to height ~1.03e6, a factor
 *        2.9e6 below the window bottom T = 3.0e12. In range or not, the input is
 *        not available at the window heights.
 *   (iii) BOUNDARY DEGENERACY. The floor alias - the single largest majorant
 *        contributor - lands at alpha_C = 1 EXACTLY, the transition point where
 *        even the in-range evaluation is at its least-controlled edge (F(alpha)
 *        has its diagonal/off-diagonal crossover at alpha = 1). Pulling the mass
 *        to the boundary is not the same as controlling it.
 * NET: the alpha > 1 gating is RIGID under any Fresnel-width choice, and a
 * REMOVABLE NORMALIZATION ARTIFACT under the conductor rescaling that the
 * section-3 L(s, chi mod p) import warrants; but removing it only RELOCATES the
 * obstruction from "pair-correlation conjecture out of range" to "mean-square vs
 * pointwise, plus GRH height-boundedness, in range." The imp-95519 zero-side
 * no-go therefore STANDS; only its FRAMING sharpens - the operative wall is the
 * pointwise/height requirement, not the raw alpha range. No bound changes; NO QED;
 * no refereed bound is changed; RH open.
 *
 * Import-light: no zeros bundle, no sibling imports. All literals re-derived.
 */

const TWO_PI = 2 * Math.PI;
const T0 = 24727519 / 200000000; // 0.123637595
const Y0 = 0.1809;
const N_LO = 690988;
const N_HI = 54799999;
const P = 97;

const xOfN = (N) => 4 * Math.PI * N * N - T0 / 16;
const heightT = (N) => xOfN(N) / 2;
const stationaryV = (N) => heightT(N) / TWO_PI; // v = x/(4 pi) ~ N^2

// stationary-point location of the (k, h) packet (imp-95519 eq 15)
const uOfKH = (k, h, N) => stationaryV(N) / (k - h / P);
// zeta-scale Montgomery frequency (imp-95519 section 4): normalized by log T
const alphaT = (k, h, N) => Math.log(uOfKH(k, h, N)) / Math.log(heightT(N));
// analytic-conductor frequency for L(s, chi mod p): normalized by log(p T/2 pi)
const conductorScale = (N) => (P * heightT(N)) / TWO_PI; // = p * v
const alphaC = (k, h, N) => Math.log(uOfKH(k, h, N)) / Math.log(conductorScale(N));

// LEVER 1 (width): alpha is width-independent. The Fresnel width enters only the
// resolution Delta = u/H = sqrt(v); alpha depends on u alone. We witness the
// decoupling: alphaT/alphaC take (k, h, N) and NO width argument, and Delta is a
// pure function of v.
const DELTA_LO = Math.sqrt(stationaryV(N_LO)); // resolution scale, ~6.91e5
const H_FLOOR_LO = uOfKH(1, P - 1, N_LO) / Math.sqrt(stationaryV(N_LO)); // Fresnel width at floor
const WIDTH_ARGCOUNT = alphaT.length; // 3 = (k, h, N); no width slot

// LEVER 2 (normalization): floor-alias frequencies under the two scales
const ALPHA_T_FLOOR_LO = alphaT(1, P - 1, N_LO); // 1.0953 (zeta scale, alpha > 1)
const ALPHA_C_FLOOR_LO = alphaC(1, P - 1, N_LO); // 1.0000 exactly (conductor scale)
const ALPHA_T_H82_LO = alphaT(1, 82, N_LO); // 1.0010 (first alpha_T > 1 alias)
const ALPHA_C_H82_LO = alphaC(1, 82, N_LO); // 0.9139 (in range under conductor)
// exact identity witness: u at (k=1, h=p-1) equals the analytic conductor p T/2 pi
const U_FLOOR_LO = uOfKH(1, P - 1, N_LO);
const CONDUCTOR_LO = conductorScale(N_LO);
const CONDUCTOR_MATCH_REL = Math.abs(U_FLOOR_LO - CONDUCTOR_LO) / CONDUCTOR_LO; // ~0 (float)

// count of alpha > 1 aliases (k = 1) under each normalization, both window ends
function overOneCounts(N) {
  let overT = 0;
  let overC = 0;
  let maxC = 0;
  for (let h = 1; h <= P - 1; h++) {
    if (1 - h / P <= 0) continue;
    const aT = alphaT(1, h, N);
    const aC = alphaC(1, h, N);
    if (aT > 1) overT += 1;
    if (aC > 1 + 1e-9) overC += 1;
    if (aC > maxC) maxC = aC;
  }
  return { overT, overC, maxC };
}
const COUNTS_LO = overOneCounts(N_LO);
const COUNTS_HI = overOneCounts(N_HI);

// Platt GRH verification height for q = 97 vs window bottom (imp-95519 section 3):
// height-boundedness survives the renormalization
const PLATT_GRH_HEIGHT_Q97 = 1e8 / P;
const HEIGHT_DEFICIT_Q97 = heightT(N_LO) / PLATT_GRH_HEIGHT_Q97; // ~2.9e6

export const IMP95534_ALPHA_GATING_RIGIDITY = Object.freeze({
  ticket: 'imp-95534',
  date: '2026-09-22',
  source:
    'imp-95519 section 4 (localized-barrier-sum zero side, alpha > 1 PCC-gating); imp-95519 section 3 (Gauss-Plancherel L(s, chi mod p) import, Platt height deficit); imp-95542 (abscissa invariance of alpha)',
  question:
    'Can the imp-95519 zero-side alpha_{k,h} > 1 gating (59.26 percent of the p = 97 majorant mass out of Montgomery range |alpha| <= 1) be pulled in-range by a different Fresnel width or Montgomery normalization, or is it rigid',

  lever1FresnelWidth: {
    verdict: 'RIGID',
    reason:
      'alpha_{k,h} = log u_{k,h}/log T is a function of the stationary-point location u_{k,h} = v/(k - h/p) alone; u is pinned by phase stationarity (phi-prime(u) = 0), independent of amplitude or window shape. The Fresnel width H_{k,h} = u/sqrt(v) sets only the resolution Delta = u/H = sqrt(v), not the centre frequency. Any window with the same stationary phase has the same u, hence the same alpha. No width choice moves any alias in or out of |alpha| <= 1.',
    deltaResolutionLo: DELTA_LO,
    fresnelWidthFloorLo: H_FLOOR_LO,
    alphaWidthArgCount: WIDTH_ARGCOUNT,
  },

  lever2Normalization: {
    verdict: 'MOVABLE (relabeling, not a rescue)',
    reason:
      'The section-3 Gauss-Plancherel lemma attaches the aliases to zeros of L(s, chi mod p); the canonical pair-correlation frequency for those zeros uses the analytic-conductor density (1/2 pi) log(p T/2 pi), i.e. alpha_C = log u/log(p T/2 pi), not the zeta scale log T. Under alpha_C all 15 alpha_T > 1 aliases fall into [0.914, 1.000]. The alpha > 1 appearance is an artifact of the zeta-scale normalization of mod-p alias frequencies.',
    exactConductorIdentity:
      'u_{1, p-1} = v/(1/p) = p v = p T/2 pi = the analytic conductor exactly, so alpha_C(floor) = 1 exactly (the largest alias frequency of the mod-p sieve equals the conductor scale).',
    alphaTFloorLo: ALPHA_T_FLOOR_LO,
    alphaCFloorLo: ALPHA_C_FLOOR_LO,
    alphaTH82Lo: ALPHA_T_H82_LO,
    alphaCH82Lo: ALPHA_C_H82_LO,
    conductorMatchRel: CONDUCTOR_MATCH_REL,
    aliasesOverOneLo: COUNTS_LO,
    aliasesOverOneHi: COUNTS_HI,
  },

  whyNoReopen: [
    'MEAN-SQUARE vs POINTWISE (imp-95519 section 4): even in range, Montgomery/Ozluk evaluate F(alpha) as a mean square over gamma in [0, T]; the contract needs the local zero sum over |gamma - T| <= Delta POINTWISE in T, uniformly over the window. Renormalization moves alpha, not this gap.',
    'GRH-HEIGHT-BOUND (imp-95519 section 3): Ozluk individual-L pair correlation in |alpha_C| <= 1 is GRH-conditional; GRH for L(s, chi mod 97) is verified (Platt) only to ~1.03e6, a factor 2.9e6 below T = 3.0e12. In range or not, the input is unavailable at the window heights.',
    'BOUNDARY DEGENERACY: the floor alias, the single largest majorant contributor, lands at alpha_C = 1 EXACTLY - the diagonal/off-diagonal crossover of F(alpha), the least-controlled edge. Pulling the mass to the boundary is not controlling it.',
  ],

  heightDeficitQ97: HEIGHT_DEFICIT_Q97,

  netVerdict:
    'The alpha > 1 gating is RIGID under any Fresnel-width choice (alpha depends on the stationary point, not the width), and a REMOVABLE NORMALIZATION ARTIFACT under the analytic-conductor rescaling that the section-3 L(s, chi mod p) import warrants (all 15 alpha_T > 1 aliases fall to alpha_C in [0.914, 1.000], the floor alias to exactly 1). But removing it only RELOCATES the obstruction from pair-correlation-conjecture-out-of-range to mean-square-vs-pointwise plus GRH-height-boundedness in range; the floor alias sits at the alpha_C = 1 boundary. The imp-95519 zero-side no-go STANDS; only its framing sharpens - the operative wall is the pointwise/height requirement, not the raw alpha range. No bound changes; NO QED; no refereed bound is changed; RH open.',

  promotesBound: false,
  isRigorous: true,
  rigorScope:
    'The width-independence of the stationary point and the exact conductor identity u_{1,p-1} = p T/2 pi are elementary and exact; the alias counts are finite computations. This is an accuracy/framing assessment of the imp-95519 zero side, not a new theorem that a bound exists.',
});

export const IMP95534_ALPHA_GATING_RIGIDITY_ASSERTIONS = Object.freeze([
  {
    id: 'imp95534-width-rigid-alpha-decoupled',
    description: 'alpha takes (k, h, N) and no width argument; Delta = sqrt(v) is the only width-set scale',
    holds: () => WIDTH_ARGCOUNT === 3 && DELTA_LO > 6.9e5 && DELTA_LO < 6.92e5 && H_FLOOR_LO > DELTA_LO,
  },
  {
    id: 'imp95534-zeta-scale-floor-over-one',
    description: 'under the zeta scale log T the floor alias has alpha_T = 1.0953 > 1 (imp-95519 section 4)',
    holds: () => Math.abs(ALPHA_T_FLOOR_LO - 1.0953) < 5e-4 && ALPHA_T_FLOOR_LO > 1,
  },
  {
    id: 'imp95534-conductor-floor-exact-one',
    description: 'u_{1,p-1} = p T/2 pi exactly, so under the conductor scale alpha_C(floor) = 1 exactly',
    holds: () => CONDUCTOR_MATCH_REL < 1e-9 && Math.abs(ALPHA_C_FLOOR_LO - 1) < 1e-9,
  },
  {
    id: 'imp95534-conductor-pulls-all-in-range',
    description: 'all 15 alpha_T > 1 aliases move to alpha_C <= 1 (none strictly above), both window ends',
    holds: () =>
      COUNTS_LO.overT === 15 &&
      COUNTS_LO.overC === 0 &&
      COUNTS_HI.overC === 0 &&
      COUNTS_LO.maxC <= 1 + 1e-9 &&
      Math.abs(ALPHA_C_H82_LO - 0.9139) < 5e-4 &&
      ALPHA_C_H82_LO < 1,
  },
  {
    id: 'imp95534-height-bound-survives',
    description: 'GRH height deficit for q = 97 (~2.9e6) is normalization-independent and still binds',
    holds: () => Math.abs(HEIGHT_DEFICIT_Q97 / 2.91e6 - 1) < 5e-3,
  },
  {
    id: 'imp95534-honesty-gate-no-qed',
    description: 'assessment only: promotes no bound, NO QED, no refereed bound is changed',
    holds: () =>
      IMP95534_ALPHA_GATING_RIGIDITY.promotesBound === false &&
      /NO QED/.test(IMP95534_ALPHA_GATING_RIGIDITY.netVerdict) &&
      /refereed bound is changed/i.test(IMP95534_ALPHA_GATING_RIGIDITY.netVerdict),
  },
]);

for (const a of IMP95534_ALPHA_GATING_RIGIDITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95534-alpha-gating-fresnel-width-normalization-rigidity assertion failed: ${a.id}`);
  }
}

export default IMP95534_ALPHA_GATING_RIGIDITY;
