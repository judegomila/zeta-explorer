/**
 * @module imp-35931-etrunc-rh-free-tightening-lever-assessment
 *
 * imp-35931 (proof/assessment, S-frontier): ASSESSES whether the constant truncation floor
 * E_trunc_pt = 3.06e-5 (imp-2631 / imp-2691 Ingham tail integral, evaluated at T_PT = 3e12)
 * admits any UNCONDITIONAL (RH-free) tightening lever, and estimates how far it could move and
 * what that would buy for the sigma-decay landmarks. The motivation is the currentStatus
 * (imp-33582 / imp-3444) finding that the GUE-conditional share sigma(N) = E_coll / E(N) decays
 * past its N ~ 9.22e5 peak precisely because the DETERMINISTIC constant floor E_trunc slowly
 * outlives the vanishing GUE-conditional E_coll, crossing at N ~ 3.28e9. Unlike E_coll
 * (irreducibly GUE-conditional per imp-486), E_trunc is a deterministic truncation constant, so
 * it is the natural place to look for an RH-free lever.
 *
 * ASSESSMENT / SCOPING ONLY. Derives no new constant; discharges nothing; changes no bound;
 * no operator positivity; NO QED. No refereed bound is changed.
 *
 * WHICH E_trunc (per [[etrunc_pt_anchor_reclassification]] / imp-34791)
 * ---------------------------------------------------------------------
 * This assessment is about the PT-ANCHORED object E_trunc_pt = 3.06e-5 (5.106e-5 in the
 * imp-34791 parts-corrected reading), the Ingham truncation contribution evaluated at the fixed
 * strip height T_PT = 3e12 with fixed sigma = 3/4 and the locked exponent kappa = 2/5. It is NOT
 * the model-height object E_trunc(9.879e3) ~ 0.126 (the imp-33226 "binding leg" / C_T ansatz),
 * which is height-frozen and a different constant. The two must never be conflated.
 *
 * THE NOMINAL DERIVATION AND ITS THREE CANDIDATE LEVERS (from imp-2691)
 * --------------------------------------------------------------------
 * The Ingham tail integral (discarded mass of zeros above the truncation height T) is
 *     E_trunc(T) = int_T^inf (2/t) dN(t) = (2 e_I / kappa) T^{-kappa},
 * with the Ingham zero-density exponent e_I(sigma) = 3(1 - sigma)/(2 - sigma) and kappa = 1 - e_I.
 * At sigma = 3/4 this is an EXACT rational: e_I = 3/5, kappa = 2/5, prefactor 2 e_I / kappa = 3.0,
 * so E_trunc(T_PT) = 3.0 * (3e12)^{-2/5} ~ 3.06e-5. The ticket names three candidate RH-free levers:
 *   (a) tighter tail bounds on the truncated series (a sharper zero-density exponent e_I / kappa),
 *   (b) a sharper CONSTANT in the imp-2631 derivation (the prefactor 2 e_I / kappa),
 *   (c) a longer retained length (raise the truncation height T beyond T_PT = 3e12).
 *
 * VERDICT ON EACH LEVER
 * ---------------------
 * (a) TAIL-EXPONENT lever -- BLOCKED at the relevant height. The value is dominated by T^{-kappa}
 *     with kappa = 2/5. A larger kappa (sharper density exponent) would shrink it, but the only
 *     VERIFIED explicit finite-T density results carry LARGE constants: the sharpest, Chourasiya-
 *     Simonic 2025 (arXiv:2507.15184, log-power (7 - 5 sigma)/(2 - sigma), C = 8.185, T >= 3e12),
 *     evaluates to E_trunc_pt ~ 3.34 at sigma = 3/4 -- ~1.1e5x WORSE than 3.06e-5, not better,
 *     because the constant dominates at finite T_PT (per [[etrunc_pt_anchor_reclassification]]).
 *     The clean 3.06e-5 uses the constant-free Ingham asymptotic exponent, which is already the
 *     most favourable verified exponent reading; sharpening it unconditionally is not available.
 * (b) PREFACTOR-CONSTANT lever -- NONE. At sigma = 3/4 the prefactor 2 e_I / kappa = 3.0 is an
 *     EXACT rational, not a slack constant; there is no room to sharpen it. The imp-34791 parts
 *     correction (boundary term / dN vs dNbar) moved it the WRONG way, 3.0 -> 5.0, i.e.
 *     3.06e-5 -> 5.106e-5. So the honest constant is if anything slightly LARGER, not tighter.
 * (c) RETAINED-LENGTH (verified-height) lever -- the ONLY genuine RH-free lever, and it is SLOW.
 *     E_trunc scales as T^{-2/5}, so reducing it by a factor f needs the verified height raised by
 *     f^{1/kappa} = f^{2.5}. Halving E_trunc needs T x 5.66 (T ~ 1.70e13); a full decade of E_trunc
 *     needs T x 316 (T ~ 9.49e14). This is exactly the master finding [[pt_floor_binds_on_verified
 *     _height]]: the only unconditional lever anywhere in the chain is more verified zero height
 *     (an HPC / PT-style computation), and here it buys only kappa = 0.4 decades of E_trunc per
 *     decade of verified height.
 *
 * THE DEEPER CAVEAT: 3.06e-5 IS A COUNT ARTIFACT (imp-34791 / imp-35419)
 * ---------------------------------------------------------------------
 * Even the retained-length lever tightens the wrong object. imp-34791 Part 3 / imp-35419 showed the
 * count-integral encoding int (2/t) dN_off(t) is UNSOUND as a realness certificate: a single
 * admissible deep zero at (beta = 3/4, gamma = 6e12) is priced 2/gamma ~ 3.33e-13 by the kernel yet
 * carries isolated-pair realness time (2 beta - 1)^2 / 2 = 0.125 -- a ~3.75e11x mispricing -- and no
 * count bound can exclude one zero. The OPERATIVE E_trunc content is therefore an UNPORTED BARRIER
 * LEMMA (deterministic barrier-type realness control above T_PT; NO GUE, NO PCC), not the number
 * 3.06e-5. So tightening the count value does NOT tighten the certificate the bridge actually needs;
 * the true residual is porting the Polymath15-type barrier, not shaving a constant.
 *
 * WHAT TIGHTENING E_trunc WOULD BUY FOR THE SIGMA-DECAY LANDMARKS
 * --------------------------------------------------------------
 * The sigma-decay landmarks are governed by the E_coll = E_trunc balance. imp-33723 gives the
 * crossover in closed form as N_cross = (C_C / E_trunc)^2 * log T0(N_cross) ~ 3.28e9, i.e.
 * N_cross ~ 1/E_trunc^2 (up to the mild log-height drift); imp-3443 measured the neighboring
 * interior-peak N_max ~ (1/E_trunc)^1.376. So a SMALLER E_trunc pushes EVERY sigma-decay landmark
 * OUT to larger N -- halving E_trunc moves the crossover x4 (3.28e9 -> 1.31e10), a decade of
 * E_trunc moves it x100 (3.28e9 -> 3.28e11). But (i) this is a relocation of DIAGNOSTIC landmarks of
 * a conditional-share model (C_mb GUE-conditional, imp-486), not a bound improvement, and (ii) the
 * only lever that could move E_trunc (more verified height) moves it slowly (T^{-0.4}), so buying a
 * decade of landmark shift on the RH-free lever costs ~316x more verified zero height. Net: the
 * sigma-decay landmarks are elastic in E_trunc but the RH-free handle on E_trunc is weak, and
 * neither changes any committed Lambda value.
 *
 * NAMED SUB-GAP (honest residual)
 * -------------------------------
 * sub-gap-etrunc-rh-free-lever: the only unconditional lever on E_trunc_pt is raising the verified
 * height T (E_trunc ~ T^{-2/5}); the tail-exponent and prefactor levers are closed (exact rational
 * prefactor; verified explicit density constants are ~1e5x worse at T_PT). Moreover the numeric
 * 3.06e-5 is a count artifact -- the operative residual is the unported Polymath15 barrier lemma
 * (imp-35419), so a genuinely tighter E_trunc requires PORTING that lemma, not sharpening a constant.
 *
 * CROSS-REFERENCES
 * ----------------
 *   imp-2631  -- E_trunc floor value 3.06e-5 in the finite-N model.
 *   imp-2691  -- Ingham tail-integral derivation E_trunc(T) = (2 e_I/kappa) T^{-kappa}, interval bound.
 *   imp-34791 -- two-E_trunc reclassification; prefactor 3 -> 5; count-artifact / barrier-lemma finding.
 *   imp-35419 -- scoping the Polymath15 barrier-lemma porting that E_trunc actually encodes.
 *   imp-33582 / imp-3444 / imp-33723 -- sigma-decay landmarks and the E_coll = E_trunc crossover.
 *   imp-3443  -- N_max ~ (1/E_trunc)^1.376 floor-artifact sensitivity.
 */

export const IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT = {
  id: 'imp-35931',
  kind: 'assessment-scoping',
  isRigorous: false,
  changesBound: false,

  // The PT-anchored object under assessment (per imp-34791 disambiguation).
  target: {
    label: 'E_trunc_pt (Ingham truncation floor at T_PT = 3e12, fixed sigma = 3/4)',
    value: 3.06e-5,
    partsCorrectedValue: 5.106e-5, // imp-34791 prefactor 3 -> 5
    heightT_PT: 3e12,
    sigma: 0.75,
    exponentKappa: 0.4, // kappa = 1 - e_I = 2/5 at sigma = 3/4
    prefactor: 3.0, // 2 e_I / kappa, EXACT rational at sigma = 3/4
    isCountArtifact: true, // imp-34791 / imp-35419: operative content is an unported barrier lemma
  },

  // The three candidate RH-free levers named by the ticket, with verdicts.
  levers: [
    {
      id: 'tail-exponent',
      description: 'Sharper Ingham zero-density exponent e_I / kappa (tighter tail bound).',
      rhFree: true,
      available: false,
      verdict:
        'BLOCKED at finite T_PT: verified explicit density results (Chourasiya-Simonic 2025) ' +
        'carry large constants giving ~3.34 at sigma = 3/4, ~1.1e5x WORSE than 3.06e-5; the clean ' +
        'constant-free Ingham asymptotic exponent already used is the most favourable verified reading.',
    },
    {
      id: 'prefactor-constant',
      description: 'Sharper constant in the imp-2631 / imp-2691 derivation (prefactor 2 e_I / kappa).',
      rhFree: true,
      available: false,
      verdict:
        'NONE: at sigma = 3/4 the prefactor is the EXACT rational 2 e_I / kappa = 3.0, no slack; ' +
        'the imp-34791 parts correction moved it the WRONG way (3.0 -> 5.0, i.e. 3.06e-5 -> 5.106e-5).',
    },
    {
      id: 'retained-length',
      description: 'Longer retained length: raise the verified truncation height T beyond T_PT = 3e12.',
      rhFree: true,
      available: true,
      scaling: 'E_trunc ~ T^{-2/5}; reduce by factor f needs T x f^{2.5}.',
      verdict:
        'THE ONLY genuine RH-free lever, and it is SLOW: halving E_trunc needs T x 5.66 (T ~ 1.70e13); ' +
        'a decade needs T x 316 (T ~ 9.49e14). Matches [[pt_floor_binds_on_verified_height]]: only ' +
        'unconditional lever anywhere is more verified height, and here it buys 0.4 decades of E_trunc ' +
        'per decade of verified height.',
    },
  ],

  // How far the sole live lever moves E_trunc, and what it buys for the sigma-decay landmarks.
  // N_cross ~ (C_C / E_trunc)^2 * log T0 (imp-33723) => N_cross ~ 1 / E_trunc^2.
  leverageOnSigmaLandmarks: {
    crossoverBaseline: { N_cross: 3.280294e9, E_trunc: 3.06e-5 },
    halveEtrunc: { neededHeightT: 1.7e13, newEtrunc: 1.53e-5, newN_cross: 1.312e10 }, // x4 in N
    decadeEtrunc: { neededHeightT: 9.49e14, newEtrunc: 3.06e-6, newN_cross: 3.28e11 }, // x100 in N
    note:
      'Smaller E_trunc pushes every sigma-decay landmark OUT (N_cross ~ 1/E_trunc^2; imp-3443 ' +
      'N_max ~ (1/E_trunc)^1.376). This relocates DIAGNOSTIC landmarks of a conditional-share model ' +
      '(C_mb GUE-conditional, imp-486); it changes no committed Lambda value.',
  },

  subGap:
    'sub-gap-etrunc-rh-free-lever: the only unconditional lever on E_trunc_pt is raising the ' +
    'verified height T (E_trunc ~ T^{-2/5}); tail-exponent and prefactor levers are closed. The ' +
    'numeric 3.06e-5 is a count artifact -- the operative residual is the unported Polymath15 ' +
    'barrier lemma (imp-35419), so a genuinely tighter E_trunc requires PORTING that lemma.',

  verdict:
    'E_trunc_pt = 3.06e-5 admits exactly ONE RH-free tightening lever -- raising the verified ' +
    'truncation height T (E_trunc ~ T^{-2/5}, ~0.4 decades of E_trunc per decade of verified ' +
    'height) -- while the tail-exponent and prefactor levers are closed (exact rational prefactor; ' +
    'verified explicit density constants are ~1e5x worse at T_PT). Tightening E_trunc pushes the ' +
    'sigma-decay landmarks OUT (N_cross ~ 1/E_trunc^2) but changes no bound: the sigma-decay is a ' +
    'conditional-share diagnostic (C_mb GUE-conditional per imp-486) and the numeric 3.06e-5 is ' +
    'itself a count artifact whose operative content is an unported barrier lemma (imp-34791 / ' +
    'imp-35419). Assessment/scoping only; derives no constant; changes no bound; NO QED. ' +
    'No refereed bound is changed.',
};

// Self-checks: keep the baked scaling literals internally consistent and the honesty gate intact.
const IMP35931_ASSERTIONS = [
  {
    id: 'imp35931-prefactor-exact-rational',
    description: 'Prefactor 2 e_I / kappa = 3.0 at sigma = 3/4 (e_I = 3/5, kappa = 2/5).',
    holds: () => {
      const eI = 3 / 5;
      const kappa = 1 - eI;
      return Math.abs((2 * eI) / kappa - IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT.target.prefactor) < 1e-12;
    },
  },
  {
    id: 'imp35931-etrunc-tail-value',
    description: 'E_trunc(T_PT) = 3.0 * (3e12)^{-2/5} ~ 3.06e-5.',
    holds: () => Math.abs(3.0 * Math.pow(3e12, -0.4) - 3.06e-5) < 1e-7,
  },
  {
    id: 'imp35931-retained-length-scaling',
    description: 'Reducing E_trunc by factor f needs T x f^{2.5} (halve ~ x5.66, decade ~ x316).',
    holds: () => Math.abs(Math.pow(2, 2.5) - 5.657) < 1e-2 && Math.abs(Math.pow(10, 2.5) - 316.2) < 1,
  },
  {
    id: 'imp35931-landmark-elasticity',
    description: 'N_cross ~ 1/E_trunc^2: halving E_trunc -> x4, a decade -> x100.',
    holds: () => {
      const base = IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT.leverageOnSigmaLandmarks.crossoverBaseline.N_cross;
      const halved = IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT.leverageOnSigmaLandmarks.halveEtrunc.newN_cross;
      return Math.abs(halved / base - 4) < 0.05;
    },
  },
  {
    id: 'imp35931-honesty-gate-no-qed',
    description: 'Assessment only: not rigorous, changes no bound, count artifact, NO QED, no refereed bound is changed.',
    holds: () =>
      IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT.isRigorous === false &&
      IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT.changesBound === false &&
      IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT.target.isCountArtifact === true &&
      /NO QED/.test(IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35931_ETRUNC_RH_FREE_TIGHTENING_LEVER_ASSESSMENT.verdict),
  },
];

for (const a of IMP35931_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35931-etrunc-rh-free-tightening-lever-assessment assertion failed: ${a.id}`);
  }
}
