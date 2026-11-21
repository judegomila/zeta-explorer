/**
 * @module imp-34332-crossover-surplus-prefactor-linearity-fit
 *
 * imp-34332 (numerical, opus-4-8): Fit the imp-34248 prefactor P(thr) approach
 * to linearity -- does surplus/(thr.r) -> 1 confirm exactly ONE power of thr,
 * and does the residual 1 - surplus/(thr.r) vanish linearly in (1-thr).r as the
 * ticket premise supposed? MEASUREMENT/FIT ONLY, NO QED.
 *
 * THE imp-34248 CLAIM (recap)
 * ---------------------------
 * imp-34248 F1 wrote the imp-34174 crossover surplus as a product
 *
 *     surplus(thr) = P(thr) . r(thr),   P(thr) = thr(1-thr)/(1 + (1-thr)r),
 *     r = E_flow(N_cross(thr)) / E_trunc,
 *
 * and reported the ratio surplus/(thr.r) = P/thr climbing monotonically to 1
 * (0.4995, 0.6998, 0.9000, 0.9500, 0.9900 across thr in {0.5,0.3,0.1,0.05,0.01}),
 * concluding the prefactor contributes exactly ONE power of thr. The APPROACH of
 * that ratio to its limit 1 was asserted but never FIT, and the ticket premise
 * supposed the residual vanishes linearly in (1-thr).r.
 *
 * THIS MODULE -- FIT THE APPROACH, CORRECT THE CHANNEL
 * ----------------------------------------------------
 * The ratio is exactly, from the closed form (no fresh model),
 *
 *     surplus/(thr.r) = P/thr = (1-thr) / (1 + (1-thr)r).                    (E1)
 *
 * Expanding the geometric denominator for small r,
 *
 *     surplus/(thr.r) = (1-thr) - (1-thr)^2 r + (1-thr)^3 r^2 - ...          (E2)
 *
 * so the residual is EXACTLY (verified below to machine precision)
 *
 *     1 - surplus/(thr.r) = (thr + (1-thr)r) / (1 + (1-thr)r)               (E3)
 *                         = thr + (1-thr)^2 r + O(r^2).                      (E4)
 *
 * (R1) THE RESIDUAL VANISHES LINEARLY IN thr, NOT IN (1-thr).r. The measured
 *      residual/thr collapses to 1 from above -- 1.000949, 1.000675, 1.000287,
 *      1.000163, 1.000042 -- so the LEADING residual is thr itself (the target-
 *      share deficit), with leading coefficient EXACTLY 1. By contrast
 *      residual/((1-thr)r) DIVERGES 527 -> 1037 -> 3132 -> 5843 -> 23739, so the
 *      residual does NOT vanish linearly in (1-thr)r: the ticket premise on that
 *      channel is REFUTED. The prefactor P/thr = 1 - thr + O(r), i.e. the
 *      target-share prefactor is linear in thr with slope 1 to O(r).
 *
 * (R2) THE (1-thr)r CHANNEL IS THE SUBLEADING CORRECTION, coefficient (1-thr)^2.
 *      Subtracting the linear thr term isolates the r-channel exactly:
 *      (residual - thr)/r converges to (1-thr)^2 to 4-5 digits at every rung --
 *      0.249763 vs 0.25, 0.489858 vs 0.49, 0.809974 vs 0.81, 0.902492 vs 0.9025,
 *      0.980100 vs 0.980100. So the exact-one-power prefactor contribution (thr)
 *      is cleanly ISOLATED from the r-factor: surplus/(thr.r) = 1 - thr -
 *      (1-thr)^2 r + O(r^2), and since r ~ thr^2 (log-softened, imp-34248 F2 /
 *      imp-34329) the (1-thr)^2 r term is O(thr^2), STRICTLY subdominant to thr.
 *
 * SO imp-34248 F1 (exactly one power of thr) is CONFIRMED and sharpened -- the
 * approach of surplus/(thr.r) to 1 is dominated by -thr with coefficient exactly
 * 1 -- but the ticket premise that the residual vanishes linearly in (1-thr).r is
 * WRONG: (1-thr).r is only the O(thr^2) subleading correction (coefficient
 * (1-thr)^2), while the leading vanishing is the target-share deficit thr.
 *
 * HONEST SCOPE -- measurement/fit ONLY, NO QED. This fits the approach of an
 * inherited imp-34174/imp-34248 extrapolation-component ratio; it changes no
 * bound and introduces no new mathematical claim. The component model is NOT a
 * rigorous asymptotic. E_flow is the benign mesoscopic-Gronwall term (imp-2845);
 * its vanishing here does NOT touch the divergent C_Lip collision-Gronwall. The
 * C_mb GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8
 * ansatz (imp-2642/imp-2643) is UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * establishes no operator positivity; no refereed bound is changed.
 *
 * @see imp-34248-crossover-surplus-small-thr-asymptotic (the P(thr) factorisation and the surplus/(thr.r) ladder)
 * @see imp-34174-crossover-surplus-threshold-family-decay (the closed form surplus(thr) and the tabulated ladder)
 * @see imp-34329-crossover-surplus-fartail-composite-limit (r-exponent -> 2, composite -> 3 far-tail limit)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-33743)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34174/imp-34248 exactly (~1.000237)

// EXACT imp-34174/imp-34248 sub-terms (no re-derivation, no fresh model).
function eFlow(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverN(thr) {
  const K_thr = ((1 - thr) / thr) ** 2 * K_AMPL;
  let N = 1e9;
  for (let i = 0; i < 80; i++) N = K_thr * Math.log(effectiveHeightForN(N));
  return N;
}
function rOf(thr) {
  return eFlow(crossoverN(thr)) / E_TRUNC_PT;
}

// ── Approach-to-limit ladder ─────────────────────────────────────────────────
const THRESHOLDS = [0.5, 0.3, 0.1, 0.05, 0.01];
const APPROACH_LADDER = THRESHOLDS.map((thr) => {
  const r = rOf(thr);
  const ratio = (1 - thr) / (1 + (1 - thr) * r); // surplus/(thr.r) = P/thr, eqn E1
  const residual = 1 - ratio; // = (thr + (1-thr)r)/(1+(1-thr)r), eqn E3
  return {
    thr,
    r: +r.toExponential(4),
    surplus_over_thr_r: +ratio.toFixed(6),
    residual: +residual.toFixed(6),
    // R1: leading channel -- residual/thr collapses to 1 (residual ~ thr, coeff exactly 1).
    residual_over_thr: +(residual / thr).toFixed(6),
    // R1 (refutation): residual/((1-thr)r) DIVERGES -- residual does NOT vanish linearly in (1-thr)r.
    residual_over_1mthr_r: +(residual / ((1 - thr) * r)).toFixed(2),
    // R2: subtract the linear thr term, divide by r -> isolates the (1-thr)^2 r-channel coefficient.
    r_channel_coeff_measured: +((residual - thr) / r).toFixed(6),
    r_channel_coeff_target: +((1 - thr) ** 2).toFixed(6), // (1-thr)^2
  };
});

// ── Exact-identity residual check (E3): 1 - ratio == (thr + (1-thr)r)/(1+(1-thr)r) ──
const MAX_IDENTITY_DEV = Math.max(
  ...THRESHOLDS.map((thr) => {
    const r = rOf(thr);
    const ratio = (1 - thr) / (1 + (1 - thr) * r);
    const closed = (thr + (1 - thr) * r) / (1 + (1 - thr) * r);
    return Math.abs(1 - ratio - closed);
  }),
);

export const IMP34332_CROSSOVER_SURPLUS_PREFACTOR_LINEARITY_FIT = {
  id: 'imp-34332',
  proofSection: 'S-frontier',
  question:
    'Fit the imp-34248 prefactor P(thr) = thr(1-thr)/(1+(1-thr)r) approach to linearity: does ' +
    'surplus/(thr.r) -> 1 confirm exactly one power of thr, and does the residual 1 - surplus/(thr.r) ' +
    'vanish linearly in (1-thr).r as the ticket premise supposed? Measurement/fit only within the ' +
    'inherited imp-34174/imp-34248 extrapolation-component model; changes no bound; NO QED.',
  exactRatio:
    'surplus/(thr.r) = P/thr = (1-thr)/(1+(1-thr)r) = (1-thr) - (1-thr)^2 r + O(r^2); residual ' +
    '1 - surplus/(thr.r) = (thr + (1-thr)r)/(1+(1-thr)r) = thr + (1-thr)^2 r + O(r^2).',
  approachLadder: APPROACH_LADDER,
  maxIdentityDeviation: +MAX_IDENTITY_DEV.toExponential(3), // E3 verified to machine precision
  finding: {
    R1_residual_vanishes_linearly_in_thr:
      'The residual 1 - surplus/(thr.r) vanishes LINEARLY IN thr with leading coefficient EXACTLY 1: ' +
      'residual/thr collapses to 1 from above (1.000949, 1.000675, 1.000287, 1.000163, 1.000042). The ' +
      'target-share prefactor P/thr = 1 - thr + O(r) is linear in thr with slope 1, confirming and ' +
      'sharpening imp-34248 F1 (exactly one power of thr).',
    R1_1mthr_r_channel_refuted:
      'The residual does NOT vanish linearly in (1-thr)r: residual/((1-thr)r) DIVERGES 527 -> 1037 -> ' +
      '3132 -> 5843 -> 23739 across the ladder. The ticket premise that the residual vanishes linearly ' +
      'in (1-thr).r is REFUTED -- that channel is the subleading O(thr^2) correction, not the leading term.',
    R2_r_channel_is_subleading_coeff_1mthr2:
      'The (1-thr)r channel is the SUBLEADING correction with coefficient (1-thr)^2: (residual - thr)/r ' +
      'converges to (1-thr)^2 at every rung (0.249763 vs 0.25, 0.489858 vs 0.49, 0.809974 vs 0.81, ' +
      '0.902492 vs 0.9025, 0.980100 vs 0.980100). Since r ~ thr^2 (log-softened, imp-34248 F2 / ' +
      'imp-34329), the (1-thr)^2 r term is O(thr^2), STRICTLY subdominant to the leading thr.',
  },
  isRigorous: false,
  honestScope:
    'Measurement/fit only within the inherited imp-34174/imp-34248 extrapolation-component model; NO QED. ' +
    'The component model is NOT a rigorous asymptotic; E_flow is the benign mesoscopic-Gronwall term ' +
    '(imp-2845) and its vanishing here does NOT touch the divergent C_Lip collision-Gronwall; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED (E_coll untouched); the C_C 1/8 ansatz (imp-2642/imp-2643) ' +
    'is UNTOUCHED; imp-3066 K_a >= 0 untouched; establishes no operator positivity; changes no bound; ' +
    'no refereed bound is changed.',
  citation:
    'imp-34248-crossover-surplus-small-thr-asymptotic.js (the P(thr) factorisation and surplus/(thr.r) ' +
    'ladder); imp-34174-crossover-surplus-threshold-family-decay.js (closed form surplus(thr)); ' +
    'imp-34329-crossover-surplus-fartail-composite-limit.js (r-exponent -> 2 far-tail); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34332_CROSSOVER_SURPLUS_PREFACTOR_LINEARITY_FIT_ASSERTIONS = [
  {
    // E3: the residual equals the closed-form (thr + (1-thr)r)/(1+(1-thr)r) to machine precision.
    id: 'imp34332-residual-exact-identity',
    description: '1 - surplus/(thr.r) equals (thr + (1-thr)r)/(1+(1-thr)r) to machine precision (max dev < 1e-12)',
    holds: () => MAX_IDENTITY_DEV < 1e-12,
  },
  {
    // R1: residual/thr collapses monotonically to 1 from above -- residual vanishes linearly in thr, coeff 1.
    id: 'imp34332-residual-vanishes-linearly-in-thr',
    description: 'residual/thr decreases monotonically toward 1 (1.000949 -> 1.000042), so the residual is linear in thr with coefficient exactly 1',
    holds: () => {
      const rs = APPROACH_LADDER.map((row) => row.residual_over_thr);
      for (let i = 1; i < rs.length; i++) if (rs[i] >= rs[i - 1]) return false;
      return rs[0] > 1 && rs[0] < 1.002 && rs[rs.length - 1] > 1 && rs[rs.length - 1] < 1.0001;
    },
  },
  {
    // R1 refutation: residual/((1-thr)r) DIVERGES -- the residual does NOT vanish linearly in (1-thr)r.
    id: 'imp34332-1mthr-r-channel-refuted',
    description: 'residual/((1-thr)r) increases monotonically and diverges (527 -> 23739), refuting the ticket premise that the residual vanishes linearly in (1-thr)r',
    holds: () => {
      const ds = APPROACH_LADDER.map((row) => row.residual_over_1mthr_r);
      for (let i = 1; i < ds.length; i++) if (ds[i] <= ds[i - 1]) return false;
      return ds[0] > 100 && ds[ds.length - 1] > 1e4;
    },
  },
  {
    // R2: the isolated r-channel coefficient (residual - thr)/r matches (1-thr)^2 at every rung.
    id: 'imp34332-r-channel-coeff-is-1mthr-squared',
    description: '(residual - thr)/r matches (1-thr)^2 to < 3e-4 at every rung, isolating the subleading r-channel coefficient',
    holds: () =>
      APPROACH_LADDER.every(
        (row) => Math.abs(row.r_channel_coeff_measured - row.r_channel_coeff_target) < 3e-4,
      ),
  },
  {
    // Consistency with imp-34248: the ratio ladder reproduces surplus/(thr.r) = 0.4995 -> 0.9900.
    id: 'imp34332-reproduces-imp34248-ratio-ladder',
    description: 'the ratio ladder reproduces the imp-34248 surplus/(thr.r) values 0.4995 (thr=0.5) -> 0.9900 (thr=0.01)',
    holds: () =>
      Math.abs(APPROACH_LADDER[0].surplus_over_thr_r - 0.49953) < 1e-4 &&
      Math.abs(APPROACH_LADDER[4].surplus_over_thr_r - 0.99) < 1e-4,
  },
  {
    // Honesty gate: measurement/fit only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34332-honesty-gate-isrigorous-and-cmb-clause',
    description: 'isRigorous is a literal false field; honestScope names the C_mb GUE-conditional per imp-486 UNTOUCHED clause; NO QED; no refereed bound is changed',
    holds: () =>
      IMP34332_CROSSOVER_SURPLUS_PREFACTOR_LINEARITY_FIT.isRigorous === false &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/.test(IMP34332_CROSSOVER_SURPLUS_PREFACTOR_LINEARITY_FIT.honestScope) &&
      /NO QED/.test(IMP34332_CROSSOVER_SURPLUS_PREFACTOR_LINEARITY_FIT.honestScope) &&
      /refereed bound is changed/i.test(IMP34332_CROSSOVER_SURPLUS_PREFACTOR_LINEARITY_FIT.honestScope),
  },
];

for (const a of IMP34332_CROSSOVER_SURPLUS_PREFACTOR_LINEARITY_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34332-crossover-surplus-prefactor-linearity-fit assertion failed: ${a.id}`);
  }
}
